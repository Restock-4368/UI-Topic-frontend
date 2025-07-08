import{x as j,B as q,y as le,W as H,d as _,o as f,e as O,A as V,z as ne,X as ae,_ as A,M as de,E as F,c as I,a as x,f as c,g as v,b as o,j as R,i as m,t as d,F as P,Y as pe,Z as ue,$ as ce,L as $,a0 as Y,m as K,U as W,P as me,Q as he,a1 as fe,R as ve,a2 as be,a3 as ge,a4 as X,a5 as Z,n as ye,l as _e,O as xe}from"./index-InIZ-6yY.js";import{O as G,U as Se}from"./user.assembler-DCCaiWAh.js";import{S as J}from"./supply.service-C0sQ-XRc.js";import{U as we}from"./unit-measurement.service-fdNxSFsA.js";import{B as ee}from"./base-modal.component-Bk1cDjre.js";import{S as ke}from"./supply.assembler-CSpomLG2.js";import{S as te}from"./supply-batch.service-Cnepvpkn.js";import{O as Ce}from"./order-to-supplier-table.component-BqEmIwEu.js";import{S as Be}from"./supply-category.service-BVPELQSN.js";var Oe=j`
    .p-divider-horizontal {
        display: flex;
        width: 100%;
        position: relative;
        align-items: center;
        margin: dt('divider.horizontal.margin');
        padding: dt('divider.horizontal.padding');
    }

    .p-divider-horizontal:before {
        position: absolute;
        display: block;
        inset-block-start: 50%;
        inset-inline-start: 0;
        width: 100%;
        content: '';
        border-block-start: 1px solid dt('divider.border.color');
    }

    .p-divider-horizontal .p-divider-content {
        padding: dt('divider.horizontal.content.padding');
    }

    .p-divider-vertical {
        min-height: 100%;
        display: flex;
        position: relative;
        justify-content: center;
        margin: dt('divider.vertical.margin');
        padding: dt('divider.vertical.padding');
    }

    .p-divider-vertical:before {
        position: absolute;
        display: block;
        inset-block-start: 0;
        inset-inline-start: 50%;
        height: 100%;
        content: '';
        border-inline-start: 1px solid dt('divider.border.color');
    }

    .p-divider.p-divider-vertical .p-divider-content {
        padding: dt('divider.vertical.content.padding');
    }

    .p-divider-content {
        z-index: 1;
        background: dt('divider.content.background');
        color: dt('divider.content.color');
    }

    .p-divider-solid.p-divider-horizontal:before {
        border-block-start-style: solid;
    }

    .p-divider-solid.p-divider-vertical:before {
        border-inline-start-style: solid;
    }

    .p-divider-dashed.p-divider-horizontal:before {
        border-block-start-style: dashed;
    }

    .p-divider-dashed.p-divider-vertical:before {
        border-inline-start-style: dashed;
    }

    .p-divider-dotted.p-divider-horizontal:before {
        border-block-start-style: dotted;
    }

    .p-divider-dotted.p-divider-vertical:before {
        border-inline-start-style: dotted;
    }

    .p-divider-left:dir(rtl),
    .p-divider-right:dir(rtl) {
        flex-direction: row-reverse;
    }
`,Pe={root:function(e){var r=e.props;return{justifyContent:r.layout==="horizontal"?r.align==="center"||r.align===null?"center":r.align==="left"?"flex-start":r.align==="right"?"flex-end":null:null,alignItems:r.layout==="vertical"?r.align==="center"||r.align===null?"center":r.align==="top"?"flex-start":r.align==="bottom"?"flex-end":null:null}}},De={root:function(e){var r=e.props;return["p-divider p-component","p-divider-"+r.layout,"p-divider-"+r.type,{"p-divider-left":r.layout==="horizontal"&&(!r.align||r.align==="left")},{"p-divider-center":r.layout==="horizontal"&&r.align==="center"},{"p-divider-right":r.layout==="horizontal"&&r.align==="right"},{"p-divider-top":r.layout==="vertical"&&r.align==="top"},{"p-divider-center":r.layout==="vertical"&&(!r.align||r.align==="center")},{"p-divider-bottom":r.layout==="vertical"&&r.align==="bottom"}]},content:"p-divider-content"},Ie=q.extend({name:"divider",style:Oe,classes:De,inlineStyles:Pe}),ze={name:"BaseDivider",extends:le,props:{align:{type:String,default:null},layout:{type:String,default:"horizontal"},type:{type:String,default:"solid"}},style:Ie,provide:function(){return{$pcDivider:this,$parentInstance:this}}};function z(t){"@babel/helpers - typeof";return z=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},z(t)}function N(t,e,r){return(e=Me(e))in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function Me(t){var e=Ae(t,"string");return z(e)=="symbol"?e:e+""}function Ae(t,e){if(z(t)!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var l=r.call(t,e);if(z(l)!="object")return l;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}var re={name:"Divider",extends:ze,inheritAttrs:!1,computed:{dataP:function(){return H(N(N(N({},this.align,this.align),this.layout,this.layout),this.type,this.type))}}},Fe=["aria-orientation","data-p"],Te=["data-p"];function Ve(t,e,r,l,s,i){return f(),_("div",V({class:t.cx("root"),style:t.sx("root"),role:"separator","aria-orientation":t.layout,"data-p":i.dataP},t.ptmi("root")),[t.$slots.default?(f(),_("div",V({key:0,class:t.cx("content"),"data-p":i.dataP},t.ptm("content")),[ne(t.$slots,"default")],16,Te)):O("",!0)],16,Fe)}re.render=Ve;var Re=j`
    .p-textarea {
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: dt('textarea.color');
        background: dt('textarea.background');
        padding-block: dt('textarea.padding.y');
        padding-inline: dt('textarea.padding.x');
        border: 1px solid dt('textarea.border.color');
        transition:
            background dt('textarea.transition.duration'),
            color dt('textarea.transition.duration'),
            border-color dt('textarea.transition.duration'),
            outline-color dt('textarea.transition.duration'),
            box-shadow dt('textarea.transition.duration');
        appearance: none;
        border-radius: dt('textarea.border.radius');
        outline-color: transparent;
        box-shadow: dt('textarea.shadow');
    }

    .p-textarea:enabled:hover {
        border-color: dt('textarea.hover.border.color');
    }

    .p-textarea:enabled:focus {
        border-color: dt('textarea.focus.border.color');
        box-shadow: dt('textarea.focus.ring.shadow');
        outline: dt('textarea.focus.ring.width') dt('textarea.focus.ring.style') dt('textarea.focus.ring.color');
        outline-offset: dt('textarea.focus.ring.offset');
    }

    .p-textarea.p-invalid {
        border-color: dt('textarea.invalid.border.color');
    }

    .p-textarea.p-variant-filled {
        background: dt('textarea.filled.background');
    }

    .p-textarea.p-variant-filled:enabled:hover {
        background: dt('textarea.filled.hover.background');
    }

    .p-textarea.p-variant-filled:enabled:focus {
        background: dt('textarea.filled.focus.background');
    }

    .p-textarea:disabled {
        opacity: 1;
        background: dt('textarea.disabled.background');
        color: dt('textarea.disabled.color');
    }

    .p-textarea::placeholder {
        color: dt('textarea.placeholder.color');
    }

    .p-textarea.p-invalid::placeholder {
        color: dt('textarea.invalid.placeholder.color');
    }

    .p-textarea-fluid {
        width: 100%;
    }

    .p-textarea-resizable {
        overflow: hidden;
        resize: none;
    }

    .p-textarea-sm {
        font-size: dt('textarea.sm.font.size');
        padding-block: dt('textarea.sm.padding.y');
        padding-inline: dt('textarea.sm.padding.x');
    }

    .p-textarea-lg {
        font-size: dt('textarea.lg.font.size');
        padding-block: dt('textarea.lg.padding.y');
        padding-inline: dt('textarea.lg.padding.x');
    }
`,Ne={root:function(e){var r=e.instance,l=e.props;return["p-textarea p-component",{"p-filled":r.$filled,"p-textarea-resizable ":l.autoResize,"p-textarea-sm p-inputfield-sm":l.size==="small","p-textarea-lg p-inputfield-lg":l.size==="large","p-invalid":r.$invalid,"p-variant-filled":r.$variant==="filled","p-textarea-fluid":r.$fluid}]}},$e=q.extend({name:"textarea",style:Re,classes:Ne}),Ee={name:"BaseTextarea",extends:ae,props:{autoResize:Boolean},style:$e,provide:function(){return{$pcTextarea:this,$parentInstance:this}}};function M(t){"@babel/helpers - typeof";return M=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},M(t)}function Ue(t,e,r){return(e=Le(e))in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function Le(t){var e=Qe(t,"string");return M(e)=="symbol"?e:e+""}function Qe(t,e){if(M(t)!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var l=r.call(t,e);if(M(l)!="object")return l;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}var ie={name:"Textarea",extends:Ee,inheritAttrs:!1,observer:null,mounted:function(){var e=this;this.autoResize&&(this.observer=new ResizeObserver(function(){requestAnimationFrame(function(){e.resize()})}),this.observer.observe(this.$el))},updated:function(){this.autoResize&&this.resize()},beforeUnmount:function(){this.observer&&this.observer.disconnect()},methods:{resize:function(){this.$el.offsetParent&&(this.$el.style.height="auto",this.$el.style.height=this.$el.scrollHeight+"px",parseFloat(this.$el.style.height)>=parseFloat(this.$el.style.maxHeight)?(this.$el.style.overflowY="scroll",this.$el.style.height=this.$el.style.maxHeight):this.$el.style.overflow="hidden")},onInput:function(e){this.autoResize&&this.resize(),this.writeValue(e.target.value,e)}},computed:{attrs:function(){return V(this.ptmi("root",{context:{filled:this.$filled,disabled:this.disabled}}),this.formField)},dataP:function(){return H(Ue({invalid:this.$invalid,fluid:this.$fluid,filled:this.$variant==="filled"},this.size,this.size))}}},je=["value","name","disabled","aria-invalid","data-p"];function qe(t,e,r,l,s,i){return f(),_("textarea",V({class:t.cx("root"),value:t.d_value,name:t.name,disabled:t.disabled,"aria-invalid":t.invalid||void 0,"data-p":i.dataP,onInput:e[0]||(e[0]=function(){return i.onInput&&i.onInput.apply(i,arguments)})},i.attrs),null,16,je)}ie.render=qe;const He={name:"PlaceOrderModalComponent",components:{BaseModal:ee,"pv-button":F,"pv-input-number":de},props:{modelValue:Boolean,selectedBatches:{type:Array,default:()=>[]}},emits:["update:modelValue","close","back","submitted"],data(){return{batchQuantities:{}}},watch:{selectedBatches:{immediate:!0,handler(t){console.log("🧪 [DetailModal] selectedBatches:",t),console.log("🧪 [groupedBySupply]:",this.groupedBySupply),t==null||t.forEach(({batch:e})=>{e&&e.id!=null&&this.batchQuantities[e.id]==null&&(this.batchQuantities={...this.batchQuantities,[e.id]:1})})}},modelValue(t){t||(this.batchQuantities={})}},computed:{groupedBySupply(){var e;const t=new Map;return(e=this.selectedBatches)==null||e.forEach(({supply:r,batch:l,supplier:s})=>{if(!r||!l)return;const i=r.id;t.has(i)||t.set(i,{supply:r,batches:[]}),t.get(i).batches.push({batch:l,supply:r,supplier:s})}),Array.from(t.values())},totalItems(){return Object.values(this.batchQuantities).reduce((t,e)=>t+(e||0),0)},totalPrice(){return this.selectedBatches.reduce((t,{batch:e,supply:r})=>{const l=this.batchQuantities[e.id]||0;return t+l*(r.price||0)},0)}},methods:{close(){this.$emit("update:modelValue",!1),this.$emit("close")},goBack(){this.$emit("back")},submitOrder(){var e,r;if(!this.selectedBatches.length){this.close();return}const t=(r=(e=this.selectedBatches[0])==null?void 0:e.supplier)==null?void 0:r.id;console.log("🧪 Confirmed supplier id:",t),this.$emit("submitted",{batches:this.selectedBatches,quantities:this.batchQuantities,supplierId:t}),this.close()}}},Ye={class:"total-footer"};function Ke(t,e,r,l,s,i){const u=v("pv-input-number"),n=v("pv-button"),h=v("base-modal");return f(),I(h,{"model-value":r.modelValue,title:"Revisar detalle de orden",onClose:i.close},{default:x(()=>[(f(!0),_(P,null,R(i.groupedBySupply,b=>(f(),_("div",{key:b.supply.id},[o("p",null,[e[0]||(e[0]=o("strong",null,"Insumo:",-1)),m(" "+d(b.supply.name),1)]),o("p",null,d(b.supply.description),1),(f(!0),_(P,null,R(b.batches,a=>(f(),_("div",{key:a.batch.id},[o("p",null," Proveedor: "+d(a.supplier.name)+" | Stock: "+d(a.batch.stock)+" | Expira: "+d(a.batch.expiration_date),1),c(u,{modelValue:s.batchQuantities[a.batch.id],"onUpdate:modelValue":g=>s.batchQuantities[a.batch.id]=g,max:a.batch.stock,min:0,showButtons:""},null,8,["modelValue","onUpdate:modelValue","max"])]))),128))]))),128)),o("div",Ye,[o("p",null,[e[1]||(e[1]=o("strong",null,"Total de unidades:",-1)),m(" "+d(i.totalItems),1)]),o("p",null,[e[2]||(e[2]=o("strong",null,"Total a pagar:",-1)),m(" S/ "+d(i.totalPrice.toFixed(2)),1)])])]),footer:x(()=>[c(n,{label:"Cancelar",class:"btn-cancel",onClick:i.close},null,8,["onClick"]),c(n,{label:"Agregar otro producto",class:"btn-back",onClick:i.goBack},null,8,["onClick"]),c(n,{label:"Confirmar orden",class:"btn-submit",onClick:i.submitOrder},null,8,["onClick"])]),_:1},8,["model-value","onClose"])}const oe=A(He,[["render",Ke],["__scopeId","data-v-807ae207"]]),We={name:"OrderNowModal",components:{BaseModal:ee,OrderDetailsModalComponent:oe,"pv-button":F,"pv-select":Y,"pv-input-text":$,"pv-checkbox":ce,"pv-data-table":ue,"pv-column":pe},props:{modelValue:Boolean},emits:["update:modelValue","close"],data(){return{step:1,selectedSupply:null,allSupplies:[],confirmedBatches:[],allBatches:[],supplierProfiles:[],selectedBatchIds:[],filteredBatches:[],fullOrder:[],showConfirmModal:!1,batchQuantities:{}}},computed:{selectedBatches(){return this.filteredBatches.filter(t=>this.selectedBatchIds.includes(t.batch.id))}},mounted(){this.loadInitialData()},methods:{async loadInitialData(){const[t,e,r,l]=await Promise.all([new J().getAll(),new te().getAll(),new W().getAll(),new me().getAll()]);this.allSupplies=ke.toEntitiesFromResponse(t),this.allBatches=e.data;const s=Se.toEntitiesFromResponse(r),i=he.toEntitiesFromResponse(l);this.supplierProfiles=s.map(u=>{const n=i.find(h=>h.userId===u.id);return{id:u.id,name:(n==null?void 0:n.name)||u.email,company:(n==null?void 0:n.companyName)||""}})},resetModal(){this.step=1,this.selectedSupply=null,this.selectedBatchIds=[],this.filteredBatches=[],this.fullOrder=[],this.showConfirmModal=!1,this.batchQuantities={}},onSupplySelect(){var r;if(!((r=this.selectedSupply)!=null&&r.id)){this.filteredBatches=[];return}const{id:t,userId:e}=this.selectedSupply;this.filteredBatches=this.allBatches.filter(l=>l.supply_id===t).map(l=>{console.log("supplier id:",l.supplierId);const s=(l==null?void 0:l.supplier_id)??e,i=this.supplierProfiles.find(n=>n.id===s)||{name:"Desconocido",id:s??0},u={batch:l,supply:this.selectedSupply,supplier:i};return this.confirmedBatches.some(n=>n.batch.id===l.id)&&!this.selectedBatchIds.includes(l.id)&&this.selectedBatchIds.push(l.id),console.log("✔️ Confirmed supplier in batch:",u.supplier),u})},toggleBatchSelection(t,e){const r=this.selectedBatchIds.indexOf(t);r>-1?(this.selectedBatchIds.splice(r,1),this.fullOrder=this.fullOrder.filter(l=>l.batch.id!==t)):(this.selectedBatchIds.push(t),this.fullOrder.push(e))},nextStep(){this.confirmedBatches||(this.confirmedBatches=[]),this.selectedBatchIds.forEach(t=>{const e=this.filteredBatches.find(r=>r.batch.id===t);e&&!this.confirmedBatches.some(r=>r.batch.id===t)&&this.confirmedBatches.push(e)}),console.log("🧪 [nextStep] confirmedBatches:",this.confirmedBatches),this.step=2,this.showConfirmModal=!0},goBackFromDetails(){this.step=1,this.showConfirmModal=!1},closeModal(){this.$emit("update:modelValue",!1),this.$emit("close")},async handleFinalConfirmation({batches:t,quantities:e,supplierId:r}){var l,s,i,u,n,h,b;console.log("🧪 supplierId recibido del modal:",r);try{const a=new K,g=new G,S=new Date,y=`Order for ${((s=(l=t[0])==null?void 0:l.supply)==null?void 0:s.name)||"supplies"}`,p=t.reduce((C,k)=>C+(e[k.batch.id]||0)*(k.supply.price||0),0),D={date:S.toISOString(),estimated_ship_date:null,estimated_ship_time:null,description:y,admin_restaurant_id:4,supplier_id:r,order_to_supplier_state_id:1,order_to_supplier_situation_id:1,requested_products_count:t.length,total_price:p,partially_accepted:!1},w=await a.create(D),T=(w==null?void 0:w.id)||((i=w==null?void 0:w.data)==null?void 0:i.id);for(const C of t){const k=e[C.batch.id]||0;k<=0||await g.create({order_to_supplier_id:T,batch_id:C.batch.id,quantity:k,accepted:!1})}(n=(u=this.$toast)==null?void 0:u.add)==null||n.call(u,{severity:"success",summary:"Orden creada",detail:"La orden ha sido registrada correctamente.",life:3e3}),this.resetModal(),this.closeModal(),this.showConfirmModal=!1}catch(a){console.error("❌ Error al crear la orden:",a),(b=(h=this.$toast)==null?void 0:h.add)==null||b.call(h,{severity:"error",summary:"Error",detail:"No se pudo crear la orden.",life:4e3})}}}},Xe={class:"modal-step"},Ze={key:0};function Ge(t,e,r,l,s,i){const u=v("pv-select"),n=v("pv-column"),h=v("pv-checkbox"),b=v("pv-data-table"),a=v("pv-button"),g=v("base-modal"),S=v("pv-toast"),y=v("order-details-modal-component");return f(),_(P,null,[c(g,{"model-value":r.modelValue,title:"Crear orden de compra",onClose:i.closeModal},{default:x(()=>[o("div",Xe,[e[2]||(e[2]=o("label",null,"Selecciona un insumo:",-1)),c(u,{modelValue:s.selectedSupply,"onUpdate:modelValue":e[0]||(e[0]=p=>s.selectedSupply=p),options:s.allSupplies,optionLabel:"name",placeholder:"Selecciona un insumo",onChange:i.onSupplySelect},null,8,["modelValue","options","onChange"]),s.filteredBatches.length?(f(),_("div",Ze,[o("h4",null,"Batches disponibles para: "+d(s.selectedSupply.name),1),c(b,{value:s.filteredBatches},{default:x(()=>[c(n,{header:"ID"},{body:x(({data:p})=>[m(d(p.batch.id),1)]),_:1}),c(n,{header:"Stock"},{body:x(({data:p})=>[m(d(p.batch.stock),1)]),_:1}),c(n,{header:"Caducidad"},{body:x(({data:p})=>[m(d(p.batch.expiration_date),1)]),_:1}),c(n,{header:"Proveedor"},{body:x(({data:p})=>[m(d(p.supplier.name),1)]),_:1}),c(n,{header:"Seleccionar"},{body:x(({data:p})=>[c(h,{value:p.batch.id,binary:!0,"model-value":s.selectedBatchIds.includes(p.batch.id),onChange:()=>i.toggleBatchSelection(p.batch.id,p)},null,8,["value","model-value","onChange"])]),_:1})]),_:1},8,["value"])])):O("",!0)])]),footer:x(()=>[c(a,{label:"Cancelar",class:"btn-cancel",onClick:i.closeModal},null,8,["onClick"]),c(a,{label:"Siguiente",class:"btn-next",disabled:!s.selectedBatchIds.length,onClick:i.nextStep},null,8,["disabled","onClick"])]),_:1},8,["model-value","onClose"]),c(S,{position:"top-right"}),c(y,{modelValue:s.showConfirmModal,"onUpdate:modelValue":e[1]||(e[1]=p=>s.showConfirmModal=p),"selected-batches":s.confirmedBatches,onSubmitted:i.handleFinalConfirmation,onBack:i.goBackFromDetails},null,8,["modelValue","selected-batches","onSubmitted","onBack"])],64)}const Je=A(We,[["render",Ge],["__scopeId","data-v-1da3f67f"]]);class se{constructor({id:e=0,order_to_supplier_id:r=0,content:l="",rating:s=0,date:i=new Date}){this.id=e,this.order_to_supplier_id=r,this.content=l,this.rating=s,this.date=new Date(i)}}class B{static toEntity(e,r){const l=new se({id:e.id,order_to_supplier_id:e.order_to_supplier_id,content:e.content,rating:e.rating,date:e.date});return r&&(l.order_to_supplier=new fe(r)),l}static toDTO(e){return{id:e.id,order_to_supplier_id:e.order_to_supplier_id,content:e.content,rating:e.rating,date:e.date.toISOString()}}}class et extends ve{constructor(){super("/comments")}async getAllComments(){return(await this.getAll()).data.map(r=>B.toEntity(r))}async getCommentById(e){const r=await this.getById(e);return B.toEntity(r)}async createComment(e){const r=B.toDTO(e),l=await this.create(r);return B.toEntity(l)}async updateComment(e,r){const l=B.toDTO(r),s=await this.update(e,l);return B.toEntity(s)}async deleteComment(e){return this.delete(e)}}const tt={name:"OrderFeedbackModal",components:{"pv-dialog":Z,"pv-button":F,"pv-textarea":ie,"pv-input-text":$,"pv-card":X,"pv-toast":ge,"pv-toast-service":be},props:{visible:Boolean,order:Object,providerProfiles:Array},emits:["close","submitted"],data(){return{rating:0,comment:""}},computed:{supplierProfile(){return this.providerProfiles.find(t=>{var e;return t.id===((e=this.order)==null?void 0:e.supplier_id)})},orderDateFormatted(){var t;return(t=this.order)!=null&&t.date?new Date(this.order.date).toLocaleDateString():"-"},totalPriceFormatted(){var t;return(t=this.order)!=null&&t.total_price?`S/. ${Number(this.order.total_price).toFixed(2)}`:"S/. 0.00"},isDelivered(){var t,e,r;return((r=(e=(t=this.order)==null?void 0:t.state)==null?void 0:e.name)==null?void 0:r.toLowerCase())==="delivered"}},methods:{close(){this.$emit("close")},setRating(t){this.rating=t},async submitFeedback(){if(!this.rating){this.$toast.add({severity:"warn",summary:"Missing rating",detail:"Please select a rating before submitting.",life:3e3});return}const t=new se({order_to_supplier_id:this.order.id,content:this.comment.trim(),rating:this.rating,date:new Date});try{await new et().createComment(t),this.$toast.add({severity:"success",summary:"Success",detail:"Your feedback was submitted",life:3e3}),this.$emit("submitted"),this.close()}catch(e){console.error("Error submitting feedback:",e),this.toast.add({severity:"error",summary:"Error",detail:"Failed to send feedback. Please try again later.",life:4e3})}}}},rt={class:"summary-item"},it={class:"summary-item"},ot={class:"summary-item"},st={class:"summary-item"},lt={class:"mt-3"},nt=["onClick"],at={class:"mt-3"};function dt(t,e,r,l,s,i){var g;const u=v("pv-toast"),n=v("pv-textarea"),h=v("pv-card"),b=v("pv-button"),a=v("pv-dialog");return f(),_(P,null,[c(u),c(a,{visible:r.visible,modal:"",header:`Send Feedback to ${((g=i.supplierProfile)==null?void 0:g.name)||"Unknown"}`,style:{width:"500px"},onHide:i.close},{default:x(()=>[o("div",null,[c(h,null,{title:x(()=>e[1]||(e[1]=[m("Order Feedback")])),content:x(()=>{var S,y;return[o("div",rt,[e[2]||(e[2]=o("strong",null,"Supplier:",-1)),m(" "+d(((S=i.supplierProfile)==null?void 0:S.name)||"Unknown"),1)]),o("div",it,[e[3]||(e[3]=o("strong",null,"Phone:",-1)),m(" "+d(((y=i.supplierProfile)==null?void 0:y.phone)||"-"),1)]),o("div",ot,[e[4]||(e[4]=o("strong",null,"Date:",-1)),m(" "+d(i.orderDateFormatted),1)]),o("div",st,[e[5]||(e[5]=o("strong",null,"Total Price:",-1)),m(" "+d(i.totalPriceFormatted),1)]),o("div",lt,[e[6]||(e[6]=o("h4",null,"Rating",-1)),o("div",null,[(f(),_(P,null,R(5,p=>o("span",{key:p,onClick:D=>i.setRating(p),style:{cursor:"pointer"}},[o("i",{class:ye(["pi",p<=s.rating?"pi-star-fill":"pi-star"])},null,2)],8,nt)),64))])]),o("div",at,[e[7]||(e[7]=o("label",{for:"comment"},"Comments:",-1)),c(n,{id:"comment",rows:"4",modelValue:s.comment,"onUpdate:modelValue":e[0]||(e[0]=p=>s.comment=p),autoResize:""},null,8,["modelValue"])])]}),_:1})])]),footer:x(()=>[c(b,{label:"Cancel",icon:"pi pi-times",onClick:i.close},null,8,["onClick"]),c(b,{label:"Submit Feedback",icon:"pi pi-check",onClick:i.submitFeedback,disabled:!i.isDelivered||s.rating===0},null,8,["onClick","disabled"])]),_:1},8,["visible","header","onHide"])],64)}const pt=A(tt,[["render",dt]]),ut={name:"OrderDetailsModal",components:{"pv-dialog":Z,"pv-button":F,"pv-card":X,"pv-divider":re},props:{visible:Boolean,order:Object,providerProfiles:Array},emits:["close"],computed:{providerProfile(){return this.providerProfiles.find(t=>{var e;return t.id===((e=this.order)==null?void 0:e.supplier_id)})},hasOrderBatches(){var t;return Array.isArray((t=this.order)==null?void 0:t.orderBatches)&&this.order.orderBatches.length>0},formattedDate(){var t;return(t=this.order)!=null&&t.date?new Date(this.order.date).toLocaleDateString():""},formattedEstimatedDate(){var t;return(t=this.order)!=null&&t.estimated_ship_date?new Date(this.order.estimated_ship_date).toLocaleDateString():""},formattedEstimatedTime(){var t;return(t=this.order)!=null&&t.estimated_ship_time?new Date(this.order.estimated_ship_time).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):""}},methods:{close(){this.$emit("close")}}},ct={key:0},mt={class:"info-grid"},ht={key:0},ft={key:1},vt={key:2},bt={key:3};function gt(t,e,r,l,s,i){const u=v("pv-divider"),n=v("pv-button"),h=v("pv-dialog");return f(),I(h,{visible:r.visible,modal:"",header:"Order Details",style:{width:"700px"},onHide:i.close},{default:x(()=>{var b,a;return[r.order?(f(),_("div",ct,[e[18]||(e[18]=o("h3",null,"Order Information",-1)),o("div",mt,[o("p",null,[e[0]||(e[0]=o("strong",null,"State:",-1)),m(" "+d(((b=r.order.state)==null?void 0:b.name)||"N/A"),1)]),o("p",null,[e[1]||(e[1]=o("strong",null,"Situation:",-1)),m(" "+d(((a=r.order.situation)==null?void 0:a.name)||"N/A"),1)]),o("p",null,[e[2]||(e[2]=o("strong",null,"Order Creation Date:",-1)),m(" "+d(i.formattedDate),1)]),o("p",null,[e[3]||(e[3]=o("strong",null,"Estimated Shipping Date:",-1)),m(" "+d(i.formattedEstimatedDate),1)]),o("p",null,[e[4]||(e[4]=o("strong",null,"Estimated Shipping Hour:",-1)),m(" "+d(i.formattedEstimatedTime),1)]),o("p",null,[e[5]||(e[5]=o("strong",null,"Total Price:",-1)),m(" S/. "+d(Number(r.order.total_price).toFixed(2)),1)]),o("p",null,[e[6]||(e[6]=o("strong",null,"Requested Products:",-1)),m(" "+d(r.order.requested_products_count||"N/A"),1)])]),c(u),e[19]||(e[19]=o("h3",null,"Supplier",-1)),i.providerProfile?(f(),_("div",ht,[o("p",null,[e[7]||(e[7]=o("strong",null,"Name:",-1)),m(" "+d(i.providerProfile.name)+" "+d(i.providerProfile.lastName),1)]),o("p",null,[e[8]||(e[8]=o("strong",null,"Phone:",-1)),m(" "+d(i.providerProfile.phone||"N/A"),1)]),o("p",null,[e[9]||(e[9]=o("strong",null,"Address:",-1)),m(" "+d(i.providerProfile.business_address||"N/A"),1)])])):(f(),_("div",ft,e[10]||(e[10]=[o("p",null,"No provider info found.",-1)]))),c(u),e[20]||(e[20]=o("h3",null,"Supplies",-1)),i.hasOrderBatches?(f(),_("div",vt,[(f(!0),_(P,null,R(r.order.orderBatches,g=>{var S,y,p,D,w,T,C,k,E,U,L,Q;return f(),_("div",{key:g.id,class:"supply-card"},[o("h4",null,d(((y=(S=g.batch)==null?void 0:S.supply)==null?void 0:y.name)||"Unnamed Supply"),1),o("p",null,[e[11]||(e[11]=o("strong",null,"Description:",-1)),m(" "+d(((D=(p=g.batch)==null?void 0:p.supply)==null?void 0:D.description)||"No description"),1)]),o("p",null,[e[12]||(e[12]=o("strong",null,"Category:",-1)),m(" "+d(((C=(T=(w=g.batch)==null?void 0:w.supply)==null?void 0:T.category)==null?void 0:C.name)||"N/A"),1)]),o("p",null,[e[13]||(e[13]=o("strong",null,"Unit:",-1)),m(" "+d(((U=(E=(k=g.batch)==null?void 0:k.supply)==null?void 0:E.unit_measurement)==null?void 0:U.name)||"N/A"),1)]),o("p",null,[e[14]||(e[14]=o("strong",null,"Price:",-1)),m(" S/. "+d(Number(((Q=(L=g.batch)==null?void 0:L.supply)==null?void 0:Q.price)||0).toFixed(2)),1)]),o("p",null,[e[15]||(e[15]=o("strong",null,"Requested Quantity:",-1)),m(" "+d(g.quantity),1)]),o("p",null,[e[16]||(e[16]=o("strong",null,"Accepted:",-1)),m(" "+d(g.accepted?"Yes":"No"),1)]),c(u)])}),128))])):(f(),_("div",bt,e[17]||(e[17]=[o("p",null,"No supplies found for this order.",-1)])))])):O("",!0)]}),footer:x(()=>[c(n,{label:"Close",icon:"pi pi-times",onClick:i.close},null,8,["onClick"])]),_:1},8,["visible","onHide"])}const yt=A(ut,[["render",gt],["__scopeId","data-v-5c5782c0"]]),_t={name:"RestaurantOrderToSupplierOverview",components:{OrderDetailsModalComponent:yt,OrderFeedbackModalComponent:pt,PlaceOrderModalComponent:oe,"pv-select":Y,"pv-input-text":$,"pv-button":F,OrderNowModal:Je,OrderToSupplierTable:Ce},data(){return{orders:[],suppliesInOrders:[],supplies:[],suppliers:[],units:[],states:[],situations:[],selectedSupplier:null,searchText:"",showOrderModal:!1,currentRestaurantId:4,showOrderDetails:!1,showFeedbackModal:!1,selectedOrder:null,batches:[],supplyCategories:[]}},computed:{filteredOrders(){return this.orders.filter(t=>{var i,u,n,h,b;const e=this.selectedSupplier?((i=t.supplier)==null?void 0:i.id)===this.selectedSupplier:!0,r=((n=(u=t.state)==null?void 0:u.name)==null?void 0:n.toLowerCase())||"",l=((b=(h=t.situation)==null?void 0:h.name)==null?void 0:b.toLowerCase())||"",s=this.searchText?r.includes(this.searchText.toLowerCase())||l.includes(this.searchText.toLowerCase()):!0;return e&&s})}},methods:{async loadData(){const[t,e,r,l,s,i,u,n,h]=await Promise.all([new K().getAll(),new G().getAll(),new J().getAll(),new W().getAll(),new we().getAll(),new _e().getAll(),new xe().getAll(),new te().getAll(),new Be().getAll()]);this.batches=n.data,this.supplyCategories=h.data;const b=t.data.filter(a=>a.admin_restaurant_id===this.currentRestaurantId);this.orders=b.map(a=>{const g=i.data.find(p=>p.id===a.order_to_supplier_state_id),S=u.data.find(p=>p.id===a.order_to_supplier_situation_id),y=l.data.find(p=>p.id===a.supplier_id);return{...a,state:g,situation:S,supplier:y}}),this.suppliesInOrders=e.data,this.supplies=r.data,this.suppliers=l.data.filter(a=>a.role_id===1).map(a=>({...a,name:a.name||a.email})),this.units=s.data,this.states=i.data,this.situations=u.data},openDetails(t){const e=this.suppliesInOrders.filter(r=>r.order_to_supplier_id===t.id).map(r=>{var n;const l=((n=this.batches)==null?void 0:n.find(h=>h.id===r.batch_id))||{},s=this.supplies.find(h=>h.id===(l==null?void 0:l.supply_id))||{},i=this.units.find(h=>h.id===(s==null?void 0:s.unit_measurement_id))||{},u=this.supplyCategories.find(h=>h.id===(s==null?void 0:s.category_id))||{};return{...r,batch:{...l,supply:{...s,unit:i,category:u}}}});this.selectedOrder={...t,orderBatches:e},this.showOrderDetails=!0},openFeedback(t){var e,r;if(((r=(e=t.state)==null?void 0:e.name)==null?void 0:r.toLowerCase())!=="delivered"){alert("Feedback is only allowed for delivered orders.");return}this.selectedOrder=t,this.showFeedbackModal=!0}},mounted(){this.loadData()},watch:{showOrderModal(t){t||setTimeout(()=>{this.loadData()},500)}}},xt={class:"overview-container"},St={class:"header"},wt={class:"filters"},kt={key:0},Ct={key:1,class:"empty-state"};function Bt(t,e,r,l,s,i){const u=v("pv-button"),n=v("pv-select"),h=v("pv-input-text"),b=v("order-to-supplier-table"),a=v("order-now-modal"),g=v("order-details-modal-component"),S=v("order-feedback-modal-component");return f(),_("div",xt,[o("div",St,[e[7]||(e[7]=o("h2",null,"My Supply Orders",-1)),c(u,{icon:"pi pi-plus",label:"Create Order",class:"btn-create",onClick:e[0]||(e[0]=y=>s.showOrderModal=!0)})]),o("div",wt,[s.suppliers.length?(f(),I(n,{key:0,modelValue:s.selectedSupplier,"onUpdate:modelValue":e[1]||(e[1]=y=>s.selectedSupplier=y),options:s.suppliers,optionLabel:"name",optionValue:"id",placeholder:"Filter by Supplier",class:"filter-select"},null,8,["modelValue","options"])):O("",!0),c(h,{modelValue:s.searchText,"onUpdate:modelValue":e[2]||(e[2]=y=>s.searchText=y),placeholder:"Search by state or situation...",class:"filter-input"},null,8,["modelValue"])]),i.filteredOrders.length?(f(),_("div",kt,[c(b,{orders:i.filteredOrders,suppliers:s.suppliers,states:s.states,situations:s.situations,onViewDetails:i.openDetails,onLeaveFeedback:i.openFeedback},null,8,["orders","suppliers","states","situations","onViewDetails","onLeaveFeedback"])])):(f(),_("div",Ct,e[8]||(e[8]=[o("i",{class:"pi pi-truck empty-icon"},null,-1),o("p",{class:"empty-text"},[m(" You currently have no orders registered."),o("br"),m(" Create a new order to start managing your purchases and supplies from this section. ")],-1)]))),c(a,{modelValue:s.showOrderModal,"onUpdate:modelValue":e[3]||(e[3]=y=>s.showOrderModal=y),onClose:e[4]||(e[4]=y=>s.showOrderModal=!1)},null,8,["modelValue"]),s.selectedOrder?(f(),I(g,{key:2,visible:s.showOrderDetails,order:s.selectedOrder,providerProfiles:s.suppliers,onClose:e[5]||(e[5]=y=>s.showOrderDetails=!1)},null,8,["visible","order","providerProfiles"])):O("",!0),s.selectedOrder?(f(),I(S,{key:3,visible:s.showFeedbackModal,order:s.selectedOrder,providerProfiles:s.suppliers,onClose:e[6]||(e[6]=y=>s.showFeedbackModal=!1)},null,8,["visible","order","providerProfiles"])):O("",!0)])}const Vt=A(_t,[["render",Bt],["__scopeId","data-v-a184a352"]]);export{Vt as default};
