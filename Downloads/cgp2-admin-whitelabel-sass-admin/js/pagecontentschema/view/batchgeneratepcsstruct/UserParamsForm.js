/**
 *详细页
 **/
Ext.define('CGP.pagecontentschema.view.batchgeneratepcsstruct.UserParamsForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.infodetail',

    //padding: 30,
    defaultType: 'textfield',
    defaults: {
        width: 400
    },
    layout: {
        type: 'table',
        // The total column count must be specified here
        columns: 2
    },
    bodyPadding: 10,
    color: 'black',
    bodyStyle: 'border-color:silver;',
    border: '1 0 0 0',
    //bodyBorder: '1 0 0 0',
    header: false,
    itemId: 'userParamsForm',

    initComponent: function () {
        var me = this;
        me.items = [{
            xtype: 'textfield',
            name: 'name',
            allowBlank: false,
            itemId: 'name',
            fieldLabel: i18n.getKey('name')
        }, {
            xtype: 'textfield',
            name: 'description',
            itemId: 'description',
            fieldLabel: i18n.getKey('description')
        }, {
            xtype: 'numberfield',
            name: 'width',
            minValue: 0,
            allowBlank: false,
            itemId: 'width',
            fieldLabel: i18n.getKey('width')
        }, {
            xtype: 'numberfield',
            name: 'height',
            minValue: 0,
            allowBlank: false,
            itemId: 'height',
            fieldLabel: i18n.getKey('height')
        }, {
            xtype: 'textfield',
            name: 'clazz',
            itemId: 'clazz',
            hidden: true,
            fieldLabel: 'clazz'
        }, {
            xtype: 'combo',
            name: 'arrangeRule',
            store: Ext.create('Ext.data.Store', {
                fields: ['name', {name: 'value', type: 'string'}],
                data: [{
                    name: i18n.getKey('LeftToRight'),
                    value: 'LeftToRight'
                }, {
                    name: i18n.getKey('RightToLeft'),
                    value: 'RightToLeft'
                }, {
                    name: i18n.getKey('TopToBottom'),
                    value: 'TopToBottom'
                }, {
                    name: i18n.getKey('BottomToTop'),
                    value: 'BottomToTop'
                },]
            }),
            displayField: 'name',
            valueField: 'value',
            allowBlank: false,
            editable: false,
            colspan: 2,
            queryMode: 'local',
            itemId: 'arrangeRule',
            fieldLabel: i18n.getKey('arrangeRule')
        },
            Ext.create('CGP.pagecontentschema.view.batchgeneratepcsstruct.CustomizingFieldSet', {
                name: 'customizingLayer',
                colspan: 2,
                itemId: 'customizingLayer',
                title: i18n.getKey('定制层'),
                margin: '10 0 10 0',
                width: 850
            }), Ext.create('CGP.pagecontentschema.view.batchgeneratepcsstruct.DisplayFieldSet', {
                name: 'displayLayer',
                colspan: 2,
                itemId: 'displayLayer',
                title: i18n.getKey('显示层'),
                margin: '10 0 10 0',
                width: 850
            })];

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
        var me = this;
        var resultData = {};
        if(me.isValid()){
            var items = me.items.items;
            Ext.Array.each(items, function (item) {
                if(item.name == 'views'){
                    resultData[item.name] = item.getSubmitValue();
                }else{
                    resultData[item.name] = item.getValue();
                }

            });
        }
        return resultData;
    }


});
