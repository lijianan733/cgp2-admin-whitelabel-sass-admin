/**
 * productInfor
 * @Author: miao
 * @Date: 2021/12/30
 */
Ext.define("CGP.returnorder.view.state.ProductInfor", {
    extend: "Ext.form.Panel",
    alias: 'widget.productinfor',
    requires: [],
    autoScroll: true,
    scroll: 'vertical',
    border: 0,
    layout: {
        type: 'table',
        columns: 2
    },
    fieldDefaults: {
        labelAlign: 'right',
        width: 500,
        labelWidth: 90,
        msgTarget: 'side'
    },
    readOnly: false,
    country: null,
    imageUrl: '',
    initComponent: function () {
        var me = this;
        var imgSize = '/100/100/png?' + Math.random();
        me.items = [
            {
                xtype: 'imagecomponent',
                name:'thumbnail',
                // src: me.imageUrl + imgSize,
                autoEl: 'div',
                style: 'cursor: pointer',
                width: 100,
                height: 100,
            },
            {
                xtype: 'fieldcontainer',
                layout: 'vbox',
                fieldDefaults: {
                    labelAlign: 'right',
                    width: 500,
                    labelWidth: 80,
                    readOnly: true
                },
                items: [
                    {
                        xtype: 'displayfield',
                        itemId: 'productName',
                        name: 'productName',
                        fieldLabel: i18n.getKey('productName'),
                        flex: 1
                    },
                    {
                        xtype: 'displayfield',
                        itemId: 'sku',
                        name: 'sku',
                        fieldLabel: i18n.getKey('sku'),
                        flex: 1
                    }
                ],
                diySetValue:function (data){
                    var me = this;
                    var items = me.items.items;
                    if (Ext.isEmpty(data) || Ext.Object.isEmpty(data)) {
                        return false;
                    }
                    for (var item of items) {
                        item.setValue(data[item.name]);
                    }
                }
            }

        ];
        me.callParent(arguments);
    },

    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        if (Ext.isEmpty(data) || Ext.Object.isEmpty(data)) {
            return false;
        }
        me.data = data;
        for (var item of items) {
            if (item.diySetValue) {
                item.diySetValue(data);
            }
            else if(item.name=='thumbnail'){
                var imgSize = '/100/100/png?' + Math.random();
                var url=projectThumbServer+data[item.name]+imgSize;
                item.setSrc(url);
            }
            else {
                item.setValue(data[item.name]);
            }
        }
    },

});