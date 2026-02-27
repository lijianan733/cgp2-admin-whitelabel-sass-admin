/**
 * Created by admin on 2019/12/21.
 */
Ext.define('CGP.pagecontentschema.view.batchgeneratepcsstruct.CustomizingFieldSet', {
    extend: 'CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.DiyFieldSet',
    colspan: 2,
    height: 110,
    productId: null,
    title: i18n.getKey('model'),
    defaults: {
        /*
         labelAlign: 'top',
         */
        allowBlank: false,
        width: 350,
        margin: '10 10 0 10'
    },
    layout: {
        type: 'table',
        columns: 3
    },
    style: {
        borderRadius: '10px'
    },
    getName: function () {
        return this.name;
    },
    isValid: function () {
        var me = this;
        var items = me.items.items;
        ;
        var isValid = true;
        items.forEach(function (item) {
            if (item.rendered) {
                if (item.isValid() == false) {
                    isValid = false;
                }
            }
        });
        return isValid;
    },
    getValue: function () {
        var me = this;
        var result = {};
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            result[item.getName()] = item.getValue();
        }
        //result.clazz = 'com.qpp.cgp.domain.attributeproperty.PropertyPathDto'
        return result
    },
    setValue: function (data) {
        var me = this;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            item.setValue(data[item.getName()]);
        }
    },
    initComponent: function () {
        var me = this;
        me.items = [
            /*{
                xtype: 'uxfieldcontainer',
                name: 'containerExcursion',
                colspan: 2,
                itemId: 'containerexcursion',
                labelAlign: 'left',
                fieldLabel: i18n.getKey('container')+i18n.getKey('偏移量'),
                layout: {
                    type: 'hbox',
                },
                defaults: {
                    labelWidth: 30,
                    allowBlank: false,
                    margin: '0 0 0 5',
                },
                items: [
                    {
                        xtype: 'numberfield',
                        name: 'x',
                        minValue: 0,
                        flex: 1,
                        itemId: 'x',
                        fieldLabel: i18n.getKey('x')
                    }, {
                        xtype: 'numberfield',
                        name: 'y',
                        minValue: 0,
                        flex: 1,
                        itemId: 'y',
                        fieldLabel: i18n.getKey('y')
                    }
                ],
            }*/{
                xtype: 'uxfieldcontainer',
                name: 'containerSize',
                colspan: 2,
                itemId: 'containerSize',
                labelAlign: 'left',
                fieldLabel: i18n.getKey('container')+i18n.getKey('宽高'),
                layout: {
                    type: 'hbox',
                },
                defaults: {
                    labelWidth: 30,
                    allowBlank: false,
                    margin: '0 0 0 5',
                },
                items: [
                    {
                        xtype: 'numberfield',
                        name: 'width',
                        minValue: 0,
                        flex: 1,
                        itemId: 'width',
                        fieldLabel: i18n.getKey('width')
                    }, {
                        xtype: 'numberfield',
                        name: 'height',
                        minValue: 0,
                        flex: 1,
                        itemId: 'height',
                        fieldLabel: i18n.getKey('height')
                    }
                ],
            }, {
                name: 'clipPath',
                xtype: 'textarea',
                rowspan: 2,
                fieldLabel: i18n.getKey('clipPath'),
                itemId: 'clipPath'
            }, {
                xtype: 'uxfieldcontainer',
                name: 'pictureSize',
                colspan: 2,
                itemId: 'pictureSize',
                labelAlign: 'left',
                fieldLabel: i18n.getKey('picture')+i18n.getKey('宽高'),
                layout: {
                    type: 'hbox',
                },
                defaults: {
                    labelWidth: 30,
                    allowBlank: false,
                    margin: '0 0 0 5',
                },
                items: [
                    {
                        xtype: 'numberfield',
                        name: 'width',
                        minValue: 0,
                        flex: 1,
                        itemId: 'width',
                        fieldLabel: i18n.getKey('width')
                    }, {
                        xtype: 'numberfield',
                        name: 'height',
                        minValue: 0,
                        flex: 1,
                        itemId: 'height',
                        fieldLabel: i18n.getKey('height')
                    }
                ],
            }
        ];
        me.callParent(arguments);
    }

});
