Ext.define('CGP.cmspage.view.CopyStaticFile',{
    extend: 'Ext.window.Window',

    width: 370,
    modal: true,
    layout: 'fit',
    bodyStyle: 'padding:10px',
    initComponent: function(){
        var me = this;

        me.title = i18n.getKey('copyStaticFile');
        me.bbar = ['->',{
            xtype: 'button',
            text: i18n.getKey('confirm'),
            handler: function(){
                if(me.form.isValid()) {
                    var data = {};
                    me.form.items.each(function(item){
                        data[item.name] =  item.getValue();
                    });
                    var tbarController = Ext.create('CGP.cmspage.controller.TbarController');
                    tbarController.copyStaticFile(data,me);
                }
            }
        },{
            xtype: 'button',
            text: i18n.getKey('cancel'),
            handler: function(){
                me.close();
            }
        }];
        var form = {
            xtype: 'form',
            border: false,
            items: [{
                xtype: 'combo',
                itemId: 'websiteId',
                name: 'websiteId',
                width: 325,
                store: Ext.create('CGP.cmspage.store.Website'),
                editable: false,
                listeners: {
                    change: function(combo,newValue){
                        var lm = me.setLoading();
                        Ext.Ajax.request({
                            url: adminPath+'api/admin/cmsPage/static/copy/'+newValue+'/exportDir',
                            method: 'GET',
                            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                            success: function(res){
                                lm.hide();
                                var response = Ext.JSON.decode(res.responseText);
                                if(response.success == true){
                                    me.form.getComponent('copyExportDir').setValue(response.data);
                                }else{
                                    Ext.Msg.alert('提示',response.data.message);
                                }
                            },
                            failure: function(res){
                                lm.hide();
                                var response = Ext.JSON.decode(res.responseText);
                                Ext.Msg.alert('提示','获取默认拷贝路径失败！'+response.data.message);
                            }
                        })
                    }
                },
                fieldLabel: i18n.getKey('website'),
                allowBlank: false,
                displayField: 'name',
                valueField: 'id',
                msgTarget: 'side'
            },{
                xtype: 'textfield',
                itemId: 'copyExportDir',
                name: 'copyExportDir',
                width: 325,
                fieldLabel: i18n.getKey('copyExportDir'),
                allowBlank: false,
                msgTarget: 'side'
            }]
        };
        me.items = [form];
        me.callParent(arguments);
        me.form = me.down('form');

    }
})