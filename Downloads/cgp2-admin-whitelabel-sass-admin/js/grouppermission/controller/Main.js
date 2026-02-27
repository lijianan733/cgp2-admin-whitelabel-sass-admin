Ext.define("CGP.grouppermission.controller.Main",{

	mixins : ['Ext.ux.util.ResourceInit'],
	requires : ["CGP.grouppermission.view.permission.Window"],
	
	
	AffectedRole : null,//删除时显示受影响的role（window）

	constructor : function(config){

		this.callParent(arguments);
	},
	
	deleteRecord : function(view,record){
		var me = this;

		view.loadMask.show();
      	var store = view.getStore();
        var roleStore = Ext.create("CGP.grouppermission.store.Role");
        roleStore.load({
              params: {
                  groupId: record.get('id')
              },
              callback: function (records, operation, success) {
                  var captionText = i18n.getKey('deleteConfirm');
                  if (operation.response != null && eval("(" + operation.response.responseText + ")").success) {
                      view.loadMask.hide();
                      me.showRoleAndDelete(record, roleStore);
                  } else {
                      Ext.MessageBox.confirm(i18n.getKey('comfirmCaption'), captionText, function (btn) {
                          if (btn == 'yes') {
	                          store.remove(record);
	                          record.destroy({
		                          callback: function (o, m) {
		                          		view.loadMask.hide();
		                                if (m.request.proxy.reader.rawData.success == true) {
		                                	Ext.ux.util.prompt(i18n.getKey('deleteSuccess'), i18n.getKey('prompt'));
		                                } else {
		                                    Ext.ux.util.prompt(i18n.getKey('deleteFailure'), i18n.getKey('prompt'));
		                                }
		                          }
	                  		  });
              			  } else {
                  				view.loadMask.hide();
                 		  }
          			  });
     			  }
              }
         });
	},
	
	
    showRoleAndDelete : function(record, roleStore) {

        var win = new Ext.window.Window({
            title: i18n.getKey('deleteConfirm') +" "+ i18n.getKey('affectedRole'),
            modal: true, //掩饰窗体后的一切。
            closeAction: 'hide',
            resizable: false,
            width: 400, // document.body.clientWidth/2,
            height: 300, //document.body.clientHeight/1.5,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            modal :true,
            items: [{
                xtype: 'grid',
                width: '100%',
                height: '100%',
                autoScroll: true,
                store: roleStore,
                columns: [{
                        text: i18n.getKey('name'),
                        width: 180,
                        dataIndex: 'name'
                    },{
                        text: i18n.getKey('description'),
                        width : 200,
                        dataIndex: 'description'
                    }]
    		}],
            buttons: [{
                xtype: 'button',
                text: i18n.getKey('destroy'),
                handler: function () {
                    win.close();
                    record.store.remove(record);
                    record.destroy({
                        callback: function (o, m) {
                            if (m.request.proxy.reader.rawData.success == true) {
                                Ext.ux.util.prompt(i18n.getKey('deleteSuccess'), i18n.getKey('prompt'));
                            } else {
                                Ext.ux.util.prompt(i18n.getKey('deleteFailure'), i18n.getKey('prompt'));
                            }
                        }
                    });
                }
   			},{
   				xtype : "button",
   				text : i18n.getKey('cancel'),
   				handler :function(btn){
   					win.close();
   				}
   			}]
        });
        win.show();
    }
});