Ext.define('CGP.product.view.productconfig.productdesignconfig.view.imageIntegrationConfigs.view.MaterialPath',{
    extend:'Ext.form.FieldContainer',

    initComponent: function () {
        var me=this;
        me.items=[
            {
                xtype: 'textarea',
                itemId: 'materialPath',
                name: 'idPath',
                flex: 1,
                value: me.materialPath,
                margin: '0 5 0 0',
                allowBlank: false,
                readOnly: true,
                fieldLabel: false
            },
            {
                xtype: 'button',
                text: i18n.getKey('choice'),
                width: 50,
                hidden: me.hideChangeMaterialPath,
                handler: function (button) {
                    var materialPath = button.ownerCt.getComponent('materialPath').getValue();
                    var component = button.ownerCt.getComponent('materialPath');
                    var controller = Ext.create('CGP.product.view.productconfig.controller.Controller');
                    controller.getMaterialPath(me.productBomConfigId, materialPath, component);
                }
            }
        ];

        me.callParent(arguments);
    },
    getName:function (){
        var me=this;
        return me.name;
    },
    getValue:function (){
        var me=this;
        return me.getComponent('materialPath').getValue();
    },
    setValue:function (data){
        var me=this;
        me.getComponent('materialPath').setValue(data);
    },
    isValid: function () {
        var me = this;
        var materialPath = me.getComponent('materialPath');
        if (me.disabled == true) {
            return true;
        } else {
            return materialPath.isValid();
        }
    }
})