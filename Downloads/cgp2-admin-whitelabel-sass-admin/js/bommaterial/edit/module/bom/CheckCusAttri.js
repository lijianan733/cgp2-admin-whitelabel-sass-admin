Ext.define("CGP.bommaterial.edit.module.bom.CheckCusAttri",{
    extend: 'Ext.window.Window',
    modal: true,
    width: 800,
    height: 500,
    layout: 'fit',
    initComponent: function(){
        var me = this;
        me.title = i18n.getKey('customAttribute');
        var customerAttribute = Ext.create('CGP.bommaterial.edit.module.customerattribute.CustomerAttribute',{
            data: me.data,
            header: false,
            border: false,
            controller: me.controller
        });

        me.items= [customerAttribute.content];
        me.bbar = ['->',{
            xtype: 'button',
            text: i18n.getKey('save'),
            handler: function(){
                me.data.customAttributes = customerAttribute.getValue();
                Ext.Ajax.request({
                    url: adminPath + 'api/admin/bom/schema/materials/'+me.data.id,
                    method: 'PUT',
                    jsonData: me.data,
                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                    success: function (res) {
                        var responseMessage = Ext.JSON.decode(res.responseText);
                        if (responseMessage.success == true) {
                            me.close();
                        }else {
                            Ext.Msg.alert("提示", "请求错误:" + responseMessage.message);
                        }
                        ;
                    },
                    failure: function () {
                        Ext.Msg.alert("提示", "请求服务器错误！");
                    }
                });
            }
        },{
            xtype: 'button',
            text: i18n.getKey('cancel'),
            handler: function(){
                me.close();
            }
        }];
        me.callParent(arguments);
        //me.toolbar.setVisible(false);
    }
})