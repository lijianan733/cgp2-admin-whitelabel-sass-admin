/**
 *详细页
 **/
Ext.define('CGP.threedmodelconfig.view.BaseInfo', {
    extend: 'Ext.form.Panel',
    alias: 'widget.infodetail',

    padding: 30,
    defaultType: 'textfield',
    defaults: {
        width: 450
    },
    bodyStyle: 'border-top:0;border-color:white;',
    header: false,
    itemId: 'baseInfo',

    initComponent: function () {
        var me = this;
        me.items = [{
            fieldLabel: i18n.getKey('name'),
            name: 'modelName',
            xtype: 'textfield',
            allowBlank: false,
            //hidden: true,
            itemId: 'name'
        }, {
            fieldLabel: i18n.getKey('description'),
            name: 'description',
            xtype: 'textarea',
            //hidden: true,
            height: 80,
            itemId: 'description'
        }];

        me.title = i18n.getKey('information');

        me.callParent(arguments);

    },
    /*    refreshData: function (data) {
            var me = this;
            Ext.Array.each(me.items.items, function (item) {
                if (item.name == 'parentId') {
                    if (data.parentMaterialType) {
                        item.setValue(data.parentMaterialType['_id']);
                        item.setVisible(true);
                    }
                } else if (item.name == 'type') {
                    item.setValue(data.clazz.split('.').pop());
                } else {
                    if(!Ext.isEmpty(data[item.name])){
                        item.setValue(data[item.name]);
                    }
                }
            });

        },*/
    getValue: function () {

    }


});
