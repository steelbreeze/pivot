var pivot;(()=>{"use strict";var e={};(()=>{var r=e;Object.defineProperty(r,"__esModule",{value:!0}),r.select=r.average=r.sum=r.count=r.query=r.cube=r.slice=r.axis=void 0;class t{static fromTable(e,r,i=(e=>e[r]),u){return t.fromValues(e.map(i).filter(((e,r,t)=>t.indexOf(e)===r)).sort(u),r,i)}static fromValues(e,r,t=(e=>e[r])){return e.map((e=>({predicate:r=>t(r)===e,criteria:[{key:r,value:e}]})))}static join(e,r){return r.reduce(((r,t)=>[...r,...e.map((e=>({predicate:r=>t.predicate(r)&&e.predicate(r),criteria:[...t.criteria,...e.criteria]})))]),[])}}function i(e,r){return r.map((r=>e.filter(r.predicate)))}function u(e){return e.length||null}function a(e){return r=>r.length?r.reduce(((r,t)=>r+e(t)),0):null}r.axis=t,r.slice=i,r.cube=function(e,r,t){return i(e,r).map((e=>i(e,t)))},r.query=function(e,r,t){return e.map((e=>e.map((e=>r(t?e.filter(t):e)))))},r.count=u,r.sum=a,r.average=function(e){return r=>r.length?a(e)(r)/u(r):null},r.select=function(e){return r=>r.map(e)}})(),pivot=e})();