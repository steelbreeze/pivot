var pivot;(()=>{"use strict";var e={};(()=>{var t=e;function r(e,t,n=(e=>e[t]),i){return r.make(e.map(n).filter(((e,t,r)=>r.indexOf(e)===t)).sort(i),t,n)}function n(e,t){return t.map((t=>e.filter(t.predicate)))}function i(e){return e.length||null}function u(e){return t=>t.length?t.reduce(((t,r)=>t+e(r)),0):null}Object.defineProperty(t,"__esModule",{value:!0}),t.average=t.sum=t.count=t.query=t.pivot=t.axis=void 0,t.axis=r,r.make=function(e,t,r=(e=>e[t])){return e.map((e=>({predicate:t=>r(t)===e,criteria:[{key:t,value:e}]})))},r.compose=function(...e){let t=e.shift();for(const r of e){let e=[];for(const n of r)e=[...e,...t.map((e=>({predicate:t=>n.predicate(t)&&e.predicate(t),criteria:[...n.criteria,...e.criteria]})))];t=e}return t},t.pivot=function(e,t,r){return n(e,t).map((e=>n(e,r)))},t.query=function(e,t){return e.map((e=>e.map(t)))},t.count=i,t.sum=u,t.average=function(e){return t=>t.length?u(e)(t)/i(t):null}})(),pivot=e})();