(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{1643:function(e,n,t){"use strict";t.r(n);var a=t(3),r=t.n(a),c=t(8),i=t.n(c),o=t(1),l=t.n(o),m=t(0),s=t.n(m),d=t(28),u=t(380),p=t(860),f=t(17),h=t.n(f),g=t(4),b=t.n(g),v=t(9),x=t.n(v),E=t(5),w=function(){return s.a.createElement("svg",{className:"icon icon-check-circle",viewBox:"0 0 50 50",fill:"none"},s.a.createElement("path",{d:"M25 49c13.255 0 24-10.745 24-24S38.255 1 25 1 1 11.745 1 25s10.745 24 24 24z"}),s.a.createElement("path",{d:"M15 24.51l7.307 7.308L35.125 19"}))};t(9)("\n  .icon.icon-check-circle\n    path\n      stroke: #1990c6\n      stroke-width: 2\n");var y=t(6),N=t(7),k=t(77),j=t.n(k),O=t(89),z=t(275);function C(){return(C=i()(r.a.mark((function e(n,t,a){var c,i,o,l,m,s,d,u,p,f,h,g,v,x,E,w;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(0!==n.indexOf("0x")){e.next=27;break}return l=b()(a,"listingId"),m=l.split("-")[1],s=context.web3,e.next=6,s.eth.getTransactionReceipt(n);case 6:if(d=e.sent){e.next=10;break}return console.log("Could not find receipt"),e.abrupt("return",null);case 10:if(u=d.logs.find((function(e){return 0===e.topics[0].indexOf("0x6ee68")}))){e.next=14;break}return console.log("Could not find log"),e.abrupt("return",null);case 14:return p=s.utils.hexToNumber(u.topics[2]),f=s.utils.hexToNumber(u.topics[3]),h=u.data,e.next=19,Object(z.get)(context.config.ipfsGateway,h,1e4);case 19:return g=e.sent,c=g.encryptedData,i="".concat(l,"-").concat(f),e.next=24,context.marketplaces[m].contract.methods.offers(p,f).call();case 24:o=e.sent,e.next=28;break;case 27:c=n;case 28:return e.prev=28,e.next=31,Object(z.get)(context.config.ipfsGateway,c,1e4);case 31:return v=e.sent,e.next=34,openpgp.message.readArmored(v.buyerData);case 34:return x=e.sent,e.next=37,openpgp.decrypt({message:x,passwords:[t]});case 37:return E=e.sent,(w=JSON.parse(E.data)).offerId=i,e.abrupt("return",{cart:w,offer:o});case 43:return e.prev=43,e.t0=e.catch(28),e.abrupt("return",null);case 46:case"end":return e.stop()}}),e,null,[[28,43]])})))).apply(this,arguments)}var I=function(e,n,t){return C.apply(this,arguments)},S=function(e){var n=e.cart,t=Object(N.a)().config;return n?s.a.createElement("div",{className:"checkout-confirmation"},s.a.createElement("div",{className:"d-none d-md-block"},s.a.createElement("h3",null,t.fullTitle)),s.a.createElement("div",{className:"thankyou"},s.a.createElement("div",{className:"check"},s.a.createElement(w,null)),s.a.createElement("div",{className:"details"},n.offerId?s.a.createElement("div",{className:"order-number"},"Order #".concat(n.offerId)):null,s.a.createElement("div",{className:"name"},"Thank you ".concat(b()(n,"userInfo.firstName")),"!"))),s.a.createElement("div",{className:"order-confirmed"},s.a.createElement("div",{className:"title"},"Your order is confirmed"),s.a.createElement("div",{className:"description"},"You’ll receive an email when your order is ready.")),s.a.createElement("div",{className:"customer-info"},s.a.createElement("h4",null,"Customer information"),s.a.createElement("div",{className:"row"},s.a.createElement("div",{className:"col-md-6"},s.a.createElement("h5",null,"Contact information"),s.a.createElement("div",{className:"value"},b()(n,"userInfo.email"))),s.a.createElement("div",{className:"col-md-6"},s.a.createElement("h5",null,"Payment method"),s.a.createElement("div",{className:"value"},b()(n,"paymentMethod.label")))),s.a.createElement("div",{className:"row"},s.a.createElement("div",{className:"col-md-6"},s.a.createElement("h5",null,"Shipping address"),s.a.createElement("div",{className:"value"},j()(n.userInfo).map((function(e,n){return s.a.createElement("div",{key:n},e)})))),s.a.createElement("div",{className:"col-md-6"},s.a.createElement("h5",null,"Billing address"),s.a.createElement("div",{className:"value"},j()(n.userInfo).map((function(e,n){return s.a.createElement("div",{key:n},e)}))))),s.a.createElement("div",{className:"row"},s.a.createElement("div",{className:"col-md-6"},s.a.createElement("h5",null,"Shipping method"),b()(n,"shipping.label")))),s.a.createElement("div",{className:"actions"},s.a.createElement("div",null,"Need help?"," ",s.a.createElement("a",{href:"mailto:".concat(t.supportEmailPlain)},"Contact us")),s.a.createElement(E.a,{className:"btn btn-primary btn-lg",to:"/"},"Continue shopping"))):s.a.createElement("div",null,"Loading...")};n.default=function(){var e=Object(N.a)().config,n=Object(m.useState)(),t=l()(n,2),a=t[0],c=t[1],o=Object(m.useState)(),f=l()(o,2),g=f[0],b=f[1],v=Object(y.b)(),E=l()(v,2)[1],w=Object(d.i)("/order/:tx"),k=Object(d.h)(),j=h.a.parse(k.search);return Object(m.useEffect)((function(){function n(){return(n=i()(r.a.mark((function n(){var t;return r.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,I(w.params.tx,j.auth,e);case 2:(t=n.sent)?(c(t.cart),b(!1),E({type:"orderComplete"})):b(!0);case 4:case"end":return n.stop()}}),n)})))).apply(this,arguments)}!function(){n.apply(this,arguments)}()}),[w.params.tx,j.auth]),Object(m.useEffect)((function(){window.orderCss||(x.a.addStylesheet(),window.orderCss=!0)}),[]),g?s.a.createElement("div",{className:"checkout"},s.a.createElement("h3",{className:"d-md-none my-4 ml-4"},e.title),s.a.createElement("div",{className:"user-details"},"Error loading order"),s.a.createElement("div",{className:"order-summary-wrap"})):a?s.a.createElement(u.a,{client:p.a},s.a.createElement("div",{className:"checkout"},s.a.createElement("h3",{className:"d-md-none my-4 ml-4"},e.title),s.a.createElement("div",{className:"user-details"},s.a.createElement(S,{cart:a})),s.a.createElement("div",{className:"order-summary-wrap"},s.a.createElement(O.a,{cart:a})))):s.a.createElement("div",{className:"loading-fullpage"},"Loading")};t(9)("\n  .checkout\n    display: flex\n    h3,h4,h5\n      font-weight: 400\n    .breadcrumbs\n      font-size: 0.8rem\n      a\n        color: #1990c6\n    > .user-details\n      flex: 7\n      padding: 3rem\n      display: flex\n      justify-content: flex-end\n      .checkout-information,.checkout-shipping\n        padding: 1rem\n        max-width: 600px\n        width: 100%\n      .actions\n        display: flex\n        justify-content: space-between\n        align-items: center\n        margin-top: 2rem\n    > .order-summary-wrap\n      padding: 3rem\n      flex: 6\n      min-height: 100vh\n      border-width: 0 0 0 1px\n      border-style: solid\n      border-color: #ddd\n      background: #f6f6f6\n\n\n  @media (max-width: 767.98px)\n    .checkout\n      flex-direction: column\n      > .user-details\n        padding: 1rem\n        order: 2\n        .checkout-information,.checkout-shipping\n          padding: 1rem 0\n        .actions\n          flex-direction: column-reverse\n          *\n            margin-bottom: 2rem\n      > .order-summary-wrap\n        padding: 1rem 1.25rem\n        border-width: 1px 0 1px 0\n        min-height: 0\n        .toggle-order-summary\n          display: flex\n          justify-content: space-between\n          .toggle\n            color: #1990c6\n          .icon-caret\n            fill: #1990c6\n            margin-left: 0.5rem\n          .icon-cart\n            margin-right: 0.5rem\n            width: 1.5rem\n          &.active\n            .icon-caret\n              transform: scaleY(-1)\n\n        .order-summary\n          margin-top: 2rem\n          display: none\n          &.show\n            display: block\n\n"),t(9)("\n  .order-summary\n    max-width: 430px\n    .item\n      display: flex\n      align-items: center\n      margin-bottom: 1rem\n      width: 100%\n      .title\n        font-weight: bold\n        flex: 1\n        .cart-options\n          font-size: 0.8rem\n          font-weight: normal\n      .price\n        font-weight: bold\n      .image\n        position: relative\n        margin-right: 1rem\n        .product-pic\n          border-radius: 0.5rem\n          border: 1px solid #ddd\n          min-width: 3rem\n        span\n          position: absolute\n          display: block\n          top: -0.5rem\n          right: -0.5rem\n          padding: 0.125rem 0.5rem\n          background: #999\n          color: #fff\n          border-radius: 1rem\n          font-size: 0.75rem\n    img\n      max-width: 60px\n    .sub-total,.total\n      margin-top: 1rem\n      padding-top: 1rem\n      border-top: 1px solid #ddd\n      > div\n        display: flex\n        justify-content: space-between\n        margin-bottom: 0.5rem\n    .total\n      font-size: 1.25rem\n\n"),t(9)("\n  .checkout-confirmation\n    width: 100%\n    max-width: 570px\n    .icon-check-circle\n      width: 3rem\n    .thankyou\n      display: flex\n      align-items: center\n      margin-top: 1rem\n      .check\n        margin-right: 1rem\n      .order-number\n        font-size: 0.875rem\n        color: #666\n      .name\n        font-size: 1.25rem\n    .order-confirmed\n      margin-top: 2rem\n      border: 1px solid #ddd\n      border-radius: 0.25rem\n      padding: 1rem\n      .title\n        font-size: 1.25rem\n        margin-bottom: 0.25rem\n      .description\n        color: #666\n    .customer-info\n      margin-top: 2rem\n      border: 1px solid #ddd\n      border-radius: 0.25rem\n      padding: 1rem\n      font-size: 0.875rem\n      color: #555\n      h4\n        font-size: 1.125rem\n        color: #333\n        margin-bottom: 0.25rem\n      h5\n        font-size: 0.875rem\n        margin-top: 1rem\n        font-weight: 500\n        color: #333\n\n")},602:function(e,n){},603:function(e,n){},623:function(e,n){},625:function(e,n){},644:function(e,n){},716:function(e,n){},792:function(e,n){},793:function(e,n){},798:function(e,n){},816:function(e,n){},817:function(e,n){}}]);