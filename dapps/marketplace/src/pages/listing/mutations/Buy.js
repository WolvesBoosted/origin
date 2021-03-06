import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import get from 'lodash/get'
import numberFormat from 'utils/numberFormat'
import { withRouter } from 'react-router-dom'
import store from 'utils/store'
const sessionStore = store('sessionStorage')

import MakeOfferMutation from 'mutations/MakeOffer'
import SwapToTokenMutation from 'mutations/SwapToToken'
import AllowTokenMutation from 'mutations/AllowToken'

import Modal from 'components/Modal'
import TransactionError from 'components/TransactionError'
import WaitForTransaction from 'components/WaitForTransaction'
import Redirect from 'components/Redirect'
import UserActivationLink from 'components/UserActivationLink'

import withCanTransact from 'hoc/withCanTransact'
import withWallet from 'hoc/withWallet'
import withWeb3 from 'hoc/withWeb3'
import withIdentity from 'hoc/withIdentity'
import withConfig from 'hoc/withConfig'
import withMessagingStatus from 'hoc/withMessagingStatus'

import { getTokenSymbol } from 'utils/tokenUtils'

import { fbt } from 'fbt-runtime'

class Buy extends Component {
  state = {}

  hasBalance() {
    const { currency } = this.props
    return get(this.props, `tokenStatus.${currency}.hasBalance`, false)
  }

  hasAllowance() {
    const { currency } = this.props
    return get(this.props, `tokenStatus.${currency}.hasAllowance`, false)
  }

  render() {
    if (this.state.onboard) {
      return <Redirect to={`/listing/${this.props.listing.id}/onboard`} />
    }
    let content

    const isLoadingData =
      get(this.props, 'tokenStatus.loading') ||
      this.props.cannotTransact === 'loading' ||
      Object.keys(this.props).some(
        key => key.endsWith('Loading') && this.props[key]
      )

    if (isLoadingData)
      return (
        <button
          className={this.props.className}
          disabled={true}
          children={<fbt desc="Loading...">Loading...</fbt>}
        />
      )

    let action = (
      <button
        className={this.props.className}
        onClick={() => this.setState({ modal: true })}
        children={this.props.children}
      />
    )

    const hasIdentity = this.props.identity
    const hasMessagingKeys = this.props.hasMessagingKeys
    const needsOnboarding =
      !hasIdentity || !this.props.wallet || !hasMessagingKeys
    const onboardingDisabled =
      localStorage.bypassOnboarding || localStorage.useWeb3Identity
        ? true
        : false

    if (needsOnboarding && !onboardingDisabled) {
      action = (
        <UserActivationLink
          className={this.props.className}
          children={this.props.children}
          location={{ pathname: `/listing/${this.props.listing.id}` }}
        />
      )
    } else {
      const { tokenStatus } = this.props
      const hasEth = get(tokenStatus, 'token-ETH.hasBalance', false)

      if (this.state.error) {
        content = this.renderTransactionError()
      } else if (this.state.waitFor) {
        content = this.renderWaitModal()
      } else if (this.state.waitForAllow) {
        content = this.renderWaitAllowModal()
      } else if (this.state.waitForSwap) {
        content = this.renderWaitSwapModal()
      } else if (this.state.allow) {
        content = this.renderAllowTokenModal()
      } else if (
        !this.hasBalance() &&
        hasEth &&
        get(this.props, 'config.proxyAccountsEnabled')
      ) {
        action = this.renderMakeOfferMutation(null, true)
      } else if (!this.hasBalance()) {
        action = this.renderSwapTokenMutation(fbt('Purchase', 'Purchase'))
        content = this.renderSwapTokenModal()
      } else if (!this.hasAllowance()) {
        action = this.renderAllowTokenMutation(fbt('Purchase', 'Purchase'))
        content = this.renderAllowTokenModal()
      } else {
        action = this.renderMakeOfferMutation()
      }
    }
    return (
      <>
        {action}
        {!this.state.modal ? null : (
          <Modal
            disableDismiss={true}
            onClose={() => this.resetState()}
            shouldClose={this.state.shouldClose}
          >
            {content}
          </Modal>
        )}
      </>
    )
  }

  resetState() {
    const newState = Object.keys(this.state).reduce((m, o) => {
      m[o] = null
      return m
    }, {})

    this.setState(newState)
  }

  renderTransactionError() {
    return (
      <TransactionError
        reason={this.state.error}
        data={this.state.errorData}
        contentOnly={true}
        onClose={() => this.setState({ shouldClose: true })}
      />
    )
  }

  renderSwapTokenModal() {
    return (
      <>
        <h2>
          <fbt desc="BuyModal.swapForToken">
            Swap for{' '}
            <fbt:param name="token">
              {getTokenSymbol(this.props.currency)}
            </fbt:param>
          </fbt>
        </h2>
        <fbt desc="BuyModal.swapForTokenDesc">
          Click below to swap ETH for{' '}
          <fbt:param name="token">
            {getTokenSymbol(this.props.currency)}
          </fbt:param>
        </fbt>
        <div className="actions">
          <button
            className="btn btn-outline-light"
            onClick={() => this.setState({ shouldClose: true })}
            children={fbt('Cancel', 'Cancel')}
          />
          {this.renderSwapTokenMutation()}
        </div>
      </>
    )
  }

  renderSwapTokenMutation(buttonContent) {
    return (
      <Mutation
        mutation={SwapToTokenMutation}
        onCompleted={({ swapToToken }) => {
          this.setState({ waitForSwap: swapToToken.id })
        }}
        onError={errorData =>
          this.setState({ waitForSwap: false, error: 'mutation', errorData })
        }
      >
        {swapToToken => (
          <button
            className={buttonContent ? this.props.className : 'btn btn-clear'}
            onClick={() => this.onSwapToToken(swapToToken)}
            children={buttonContent || fbt('Purchase', 'Purchase')}
          />
        )}
      </Mutation>
    )
  }

  renderWaitSwapModal() {
    return (
      <WaitForTransaction
        hash={this.state.waitForSwap}
        onClose={() => this.setState({ waitForSwap: null })}
        contentOnly={true}
        event="TokenPurchase"
      >
        {({ event }) => {
          const eth = numberFormat(
              web3.utils.fromWei(
                get(event, 'returnValuesArr.1.value', '0'),
                'ether'
              ),
              5
            ),
            tokenValue = numberFormat(
              web3.utils.fromWei(
                get(event, 'returnValuesArr.2.value', '0'),
                'ether'
              ),
              2
            )
          return (
            <div className="make-offer-modal success">
              <div className="success-icon-lg" />
              <h5>
                <fbt desc="success">Success!</fbt>
              </h5>
              <div className="help">
                <fbt desc="buy.swappedEthForToken">
                  Swapped
                  <fbt:param name="eth">${eth}</fbt:param>
                  ETH for
                  <fbt:param name="tokenValue">${tokenValue}</fbt:param>
                  <fbt:param name="token">
                    {getTokenSymbol(this.props.currency)}
                  </fbt:param>
                </fbt>
              </div>
              {this.hasAllowance() ? (
                this.renderMakeOfferMutation(
                  <fbt desc="continue">Continue</fbt>
                )
              ) : (
                <>
                  <div className="help">
                    <fbt desc="buy.authorizeOriginMoveToken">
                      Please authorize Origin to move{' '}
                      <fbt:param name="token">
                        {getTokenSymbol(this.props.currency)}
                      </fbt:param>{' '}
                      on your behalf.
                    </fbt>
                  </div>
                  {this.renderAllowTokenMutation()}
                </>
              )}
            </div>
          )
        }}
      </WaitForTransaction>
    )
  }

  renderAllowTokenModal() {
    return (
      <>
        <h2>
          <fbt desc="BuyModal.approveToken">
            Approve{' '}
            <fbt:param name="token">
              {getTokenSymbol(this.props.currency)}
            </fbt:param>
          </fbt>
        </h2>
        <fbt desc="buy.approveTokenForOrigin">
          Click below to approve{' '}
          <fbt:param name="token">
            {getTokenSymbol(this.props.currency)}
          </fbt:param>{' '}
          for use on Origin
        </fbt>
        <div className="actions">
          <button
            className="btn btn-outline-light"
            onClick={() => this.setState({ shouldClose: true })}
            children={fbt('Cancel', 'Cancel')}
          />
          {this.renderAllowTokenMutation()}
        </div>
      </>
    )
  }

  renderAllowTokenMutation(buttonContent) {
    return (
      <Mutation
        mutation={AllowTokenMutation}
        onCompleted={({ updateTokenAllowance }) => {
          this.setState({ waitForAllow: updateTokenAllowance.id })
        }}
        onError={errorData =>
          this.setState({ waitForAllow: false, error: 'mutation', errorData })
        }
      >
        {allowToken => (
          <button
            className={buttonContent ? this.props.className : 'btn btn-clear'}
            onClick={() => this.onAllowToken(allowToken)}
            children={buttonContent || fbt('Approve', 'Approve')}
          />
        )}
      </Mutation>
    )
  }

  renderMakeOfferMutation(btnContent, autoswap) {
    return (
      <Mutation
        mutation={MakeOfferMutation}
        onCompleted={({ makeOffer }) => {
          this.setState({ waitFor: makeOffer.id })
        }}
        onError={errorData =>
          this.setState({ waitFor: false, error: 'mutation', errorData })
        }
      >
        {makeOffer => (
          <button
            className={btnContent ? 'btn btn-clear' : this.props.className}
            onClick={() => this.onClick(makeOffer, autoswap)}
            children={btnContent || this.props.children}
          />
        )}
      </Mutation>
    )
  }

  onClick(makeOffer, autoswap = false) {
    if (!this.canTransact()) {
      return
    }

    this.setState({ modal: true, waitFor: 'pending' })

    const {
      listing,
      value,
      quantity,
      startDate,
      endDate,
      currency,
      shippingAddress
    } = this.props

    const variables = {
      listingID: listing.id,
      value,
      currency: currency || 'token-ETH',
      from: this.props.walletProxy,
      quantity: Number(quantity),
      autoswap
    }

    let commission = 0
    if (listing.commissionPerUnit) {
      commission = Number(listing.commissionPerUnit) * Number(quantity)
    } else if (listing.commission) {
      commission = Number(listing.commission)
    }
    if (commission) {
      const amount = web3.utils.toBN(
        web3.utils.toWei(String(commission), 'ether')
      )
      const depositAvailable = web3.utils.toBN(listing.depositAvailable)
      const commissionWei = amount.lt(depositAvailable)
        ? amount.toString()
        : depositAvailable.toString()
      variables.commission = web3.utils.fromWei(commissionWei, 'ether')
    }

    if (
      listing.__typename === 'FractionalListing' ||
      listing.__typename === 'FractionalHourlyListing'
    ) {
      variables.fractionalData = { startDate, endDate }
    }

    if (listing.requiresShipping) {
      variables.shippingAddress = shippingAddress
    }

    makeOffer({ variables })
  }

  canTransact() {
    if (this.props.disabled) {
      return false
    }
    if (this.props.cannotTransact === 'no-wallet') {
      const { pathname, search } = this.props.location
      sessionStore.set('getStartedRedirect', { pathname, search })
      this.setState({ onboard: true })
      return false
    } else if (this.props.cannotTransact) {
      this.setState({
        modal: true,
        error: this.props.cannotTransact,
        errorData: this.props.cannotTransactData
      })
      return false
    }

    return true
  }

  onSwapToToken(swapToToken) {
    if (!this.canTransact()) {
      return
    }

    this.setState({ modal: true, waitForSwap: 'pending' })
    const { currency, walletProxy, tokenStatus } = this.props
    const tokenValue = get(tokenStatus, `${currency}.needsBalance`)

    const variables = { from: walletProxy, token: currency, tokenValue }
    swapToToken({ variables })
  }

  onAllowToken(allowToken) {
    if (!this.canTransact()) {
      return
    }

    this.setState({ modal: true, waitForAllow: 'pending' })

    let to = this.props.listing.contractAddr
    const forceProxy = this.props.config.proxyAccountsEnabled
    const predictedProxy = this.props.walletPredictedProxy
    if (forceProxy && predictedProxy !== this.props.wallet) {
      to = predictedProxy
    }

    const variables = {
      to,
      token: this.props.currency,
      from: this.props.walletProxy,
      value: this.props.value
    }

    allowToken({ variables })
  }

  renderWaitModal() {
    return (
      <WaitForTransaction
        hash={this.state.waitFor}
        event="OfferCreated"
        contentOnly={true}
      >
        {({ event }) => (
          <div className="make-offer-modal success">
            <div className="success-icon" />
            <h5>
              <fbt desc="success">Success!</fbt>
            </h5>
            <div className="disclaimer">
              <fbt desc="buy.successOffer">
                You have made an offer on this listing. Your offer will be
                visible within a few seconds. Your ETH payment has been
                transferred to an escrow contract.
              </fbt>
            </div>
            <button
              href="#"
              className="btn btn-outline-light"
              onClick={() => {
                this.setState({ loading: true })
                const { offerID } = event.returnValues
                const offerId = `${this.props.listing.id}-${offerID}`
                const redirect = `/purchases/${offerId}`

                if (this.props.refetch) {
                  this.props.refetch(redirect)
                }
              }}
              children={
                this.state.loading
                  ? fbt('Loading...', 'Loading...')
                  : fbt('View Purchase Details', 'View Purchase Details')
              }
            />
          </div>
        )}
      </WaitForTransaction>
    )
  }

  renderWaitAllowModal() {
    return (
      <WaitForTransaction hash={this.state.waitForAllow} contentOnly={true}>
        {() => (
          <div className="make-offer-modal success">
            <div className="success-icon-lg" />
            <h5>
              <fbt desc="success">Success!</fbt>
            </h5>
            <div className="help">
              <fbt desc="buy.sucessMoveToken">
                Origin may now move{' '}
                <fbt:param name="token">
                  {getTokenSymbol(this.props.currency)}
                </fbt:param>{' '}
                on your behalf.
              </fbt>
            </div>
            {this.renderMakeOfferMutation(fbt('Continue', 'Continue'))}
          </div>
        )}
      </WaitForTransaction>
    )
  }
}

export default withConfig(
  withMessagingStatus(
    withWeb3(withWallet(withIdentity(withCanTransact(withRouter(Buy))))),
    { excludeData: true }
  )
)

require('react-styl')(`
  .historical-warning
    border-radius: 0.625rem
    border: solid 1px #ffc000
    background-color: rgba(255, 192, 0, 0.1)
    padding: 0.75rem 1.25rem
  .make-offer-modal
    display: flex
    flex-direction: column
    align-items: center
    .success-icon
      background: url(images/circular-check-button.svg) no-repeat center
      background-size: contain
      height: 3.5rem
      width: 3.5rem
      margin-bottom: 2rem
    .success-icon-lg
      background: var(--greenblue) url(images/checkmark-white.svg) no-repeat center;
      background-size: 60%;
      border-radius: 3rem;
      border: 6px solid var(--white);
      height: 6rem;
      width: 6rem;
      margin-bottom: 2rem;
    .error-icon
      width: 100%
    .spinner,.error-icon
      margin-bottom: 2rem
    .btn
      margin-top: 2rem
    .disclaimer
      font-size: 14px
      margin-top: 1rem
    &.success
      ul
        text-align: left
        margin-bottom: 0
        margin-top: 1rem
        li
          margin-bottom: 0.5rem
    .metamask-video
      margin-bottom: 1rem

  @media (max-width: 767.98px)
    .make-offer-modal
      .btn
        margin-top: 1rem
      .spinner,.error-icon
        margin-bottom: 1rem

`)
