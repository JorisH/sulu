define(["mvc/relationalstore","text!sulucontact/components/accounts/components/contacts/contact-relation.form.html"],function(a,b){"use strict";var c={relationFormSelector:"#contact-relation-form",contactSelector:"#contact-field",positionSelector:"#company-contact-position"},d=null,e=function(){this.sandbox.on("husky.datagrid.item.click",function(a){this.sandbox.emit("sulu.contacts.contact.load",a),this.sandbox.emit("husky.navigation.select-item","contacts/contacts")},this),this.sandbox.on("sulu.list-toolbar.delete",function(){this.sandbox.emit("husky.datagrid.items.get-selected",function(a){this.sandbox.emit("sulu.contacts.accounts.delete",a)}.bind(this))},this),this.sandbox.on("sulu.header.back",function(){this.sandbox.emit("sulu.contacts.accounts.list")},this),this.sandbox.on("sulu.contacts.accounts.contact.saved",function(a){this.sandbox.emit("husky.datagrid.record.add",a)},this),this.sandbox.on("sulu.contacts.accounts.contacts.removed",function(a){this.sandbox.emit("husky.datagrid.record.remove",a)},this),this.sandbox.on("husky.datagrid.radio.selected",function(a){this.sandbox.emit("sulu.contacts.accounts.contacts.set-main",a)},this),this.sandbox.on("husky.select.company-position-select.selected.item",function(a){d=a},this)},f=function(a){var d,e;a=this.sandbox.util.extend(!0,{},{translate:this.sandbox.translate,position:""},a),d=this.sandbox.util.template(b,a),e=this.sandbox.dom.createElement("<div />"),this.sandbox.dom.append(this.$el,e),this.sandbox.start([{name:"overlay@husky",options:{el:e,title:this.sandbox.translate("contact.accounts.add-contact"),openOnStart:!0,removeOnClose:!0,instanceName:"contact-relation",data:d,okCallback:i.bind(this)}},{name:"auto-complete@husky",options:{el:c.contactSelector,remoteUrl:"/admin/api/contacts?flat=true&fields=id,fullName&searchFields=fullName",getParameter:"search",resultKey:"contacts",instanceName:"contact",valueKey:"fullName",noNewValues:!0}}]),this.sandbox.util.load("/admin/api/contact/positions").then(function(a){this.sandbox.start([{name:"select@husky",options:{el:c.positionSelector,instanceName:"company-position-select",valueName:"position",returnValue:"id",data:a._embedded.positions,noNewValues:!0}}])}.bind(this)).fail(function(a,b){this.sandbox.logger.error(a,b)}.bind(this)),this.data=a},g=function(){this.sandbox.emit("husky.datagrid.items.get-selected",function(a){a.length>0&&this.sandbox.emit("sulu.contacts.accounts.contacts.remove",a)}.bind(this))},h=function(){return[{id:"add",icon:"plus-circle","class":"highlight-white",title:"add",position:10,callback:f.bind(this)},{id:"settings",icon:"gear",items:[{title:this.sandbox.translate("contact.accounts.contact-remove"),callback:g.bind(this)}]}]},i=function(){var a=this.sandbox.dom.find(c.contactSelector+" input",c.relationFormSelector),b=this.sandbox.dom.data(a,"id");b&&this.sandbox.emit("sulu.contacts.accounts.contact.save",b,d)};return{view:!0,layout:{sidebar:{width:"fixed",cssClasses:"sidebar-padding-50"}},templates:["/admin/contact/template/contact/list"],initialize:function(){this.render(),e.call(this),this.options.data&&this.options.data.id&&this.initSidebar("/admin/widget-groups/account-detail?account=",this.options.data.id)},initSidebar:function(a,b){this.sandbox.emit("sulu.sidebar.set-widget",a+b)},render:function(){a.reset(),this.sandbox.emit("sulu.",this.options.account),this.sandbox.dom.html(this.$el,this.renderTemplate("/admin/contact/template/contact/list")),this.sandbox.sulu.initListToolbarAndList.call(this,"accountsContactsFields","/admin/api/contacts/fields?accountContacts=true",{el:this.$find("#list-toolbar-container"),instanceName:"contacts",inHeader:!0,template:h},{el:this.sandbox.dom.find("#people-list",this.$el),url:"/admin/api/accounts/"+this.options.data.id+"/contacts?flat=true",searchInstanceName:"contacts",searchFields:["fullName"],resultKey:"contacts",contentFilters:{isMainContact:"radio"},viewOptions:{table:{fullWidth:!0,selectItem:{type:"checkbox"},removeRow:!1}}})}}});