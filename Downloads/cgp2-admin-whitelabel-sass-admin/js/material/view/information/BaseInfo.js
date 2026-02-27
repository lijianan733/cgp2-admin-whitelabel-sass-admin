/**
 *详细页
 **/
Ext.syncRequire(['CGP.material.view.information.views.UxFieldContainer']);
Ext.define('CGP.material.view.information.BaseInfo', {
    extend: 'Ext.form.Panel',
    alias: 'widget.infodetail',

    padding: 30,
    defaultType: 'textfield',
    defaults: {
        width: 450,
        labelAlign: 'left',
        labelWidth: 50
    },
    itemId: 'baseInfo',

    initComponent: function () {
        var me = this;
        me.items = [
            {
                fieldLabel: i18n.getKey('id'),
                name: '_id',
                //hidden: true,
                fieldStyle: 'background-color:silver',
                itemId: 'id',
                readOnly: true
            },
            {
                fieldLabel: i18n.getKey('catalog'),
                name: 'categoryName',
                //hidden: true,
                xtype: 'displayfield',
                fieldStyle: 'background-color:silver',
                itemId: 'categoryName',
                readOnly: true,
            },
            {
                xtype: 'combo',
                editable: false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    data: [
                        {name: 'SMU', value: 'MaterialSpu'}
                        ,
                        {name: 'SMT', value: 'MaterialType'}
                    ]
                }),
                queryMode: 'local',
                displayField: 'name',
                valueField: 'value',
                allowBlank: false,
                fieldLabel: i18n.getKey('type'),
                name: 'type',
                fieldStyle: 'background-color:silver',
                readOnly: true,
                itemId: 'type'
            },
            {
                xtype: 'combo',
                fieldLabel: i18n.getKey('isOutsourcing'),
                name: 'isOutSourcing',
                editable: false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', {name: 'value', type: 'boolean'}],
                    data: [
                        {name: '是', value: true}
                        ,
                        {name: '否', value: false}
                    ]
                }),
                queryMode: 'local',
                displayField: 'name',
                valueField: 'value',
                allowBlank: false,
                itemId: 'isOutsourcing'
            }, {
                fieldLabel: i18n.getKey('name'),
                name: 'name',
                itemId: 'name'
            }, {
                fieldLabel: i18n.getKey('code'),
                name: 'code',
                itemId: 'code'
            }, {
                fieldLabel: i18n.getKey('parentId'),
                name: 'parentId',
                hidden: true,
                fieldStyle: 'background-color:silver',
                readOnly: true,
                itemId: 'parentId'
            }, {
                xtype: 'combo',
                fieldLabel: i18n.getKey('是否一套'),
                name: 'isPackage',
                editable: false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', {name: 'value', type: 'boolean'}],
                    data: [
                        {name: '是', value: true}
                        ,
                        {name: '否', value: false}
                    ]
                }),
                queryMode: 'local',
                listeners: {
                    change: function (view, newValue, oldValue) {
                        var packageQty = view.ownerCt.getComponent('packageQty');
                        if (newValue == true) {
                            packageQty.setVisible(true);
                            packageQty.setDisabled(false);
                        } else {
                            packageQty.setVisible(false);
                            packageQty.setDisabled(true);
                        }
                    }
                },
                displayField: 'name',
                valueField: 'value',
                value: false,
                allowBlank: false,
                itemId: 'isPackage'
            }, {
                fieldLabel: i18n.getKey('每套数量'),
                name: 'packageQty',
                hidden: true,
                xtype: 'numberfield',
                minValue: 0,
                allowBlank: false,
                disabled: true,
                itemId: 'packageQty'
            }];

        me.title = i18n.getKey('information');

        me.callParent(arguments);

    },
    refreshData: function (data) {
        var me = this;
        Ext.Array.each(me.items.items, function (item) {
            if (item.name == 'parentId') {
                if (data.parentMaterialType) {
                    item.setValue(data.parentMaterialType['_id']);
                    item.setVisible(true);
                } else {
                    item.setValue(null);
                    item.setVisible(false);
                }
            } else if (item.name == 'type') {
                item.setValue(data.clazz.split('.').pop());
            } else if (item.name == 'categoryName') {
                if (data['category']) {
                    item.setValue('<a href="#" style="color: blue" title="查看物料分类">' + data['categoryName'] + '<' + data['category'] + '></a>');
                    var a = item.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                    ela.on("click", function () {
                        JSOpen({
                            id: 'materialpage',
                            url: path + "partials/material/material.html?categoryId=" + data['category'],
                            title: i18n.getKey('produce') + i18n.getKey('materialTree'),
                            refresh: true
                        });
                    });
                }
            } else {
                if (!Ext.isEmpty(data[item.name])) {
                    item.setValue(data[item.name]);
                }
            }
        });

    }


});
