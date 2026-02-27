/**
 * @author xiu
 * @date 2023/2/20
 */
Ext.Loader.syncRequire([
    'partner.productSupplier.view.ManufactureContainer',
    'partner.productSupplier.view.AddressMatcher',
    'partner.productSupplier.view.ProductOfManufacture',
    'partner.productSupplier.view.ProductOfManufactureV2'
])
Ext.define('partner.productSupplier.view.EditPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.edit_panel',
    defaults: {
        margin: '10 20 10 0',
    },
    autoScroll: true,
    queryData: null,
    isEmpty: null,
    controller: null,
    layout: 'vbox',
    diyGetValue: function () {
        var result = {};
        var me = this;
        var items = me.items.items;
        items.forEach(item => {
            var name = item.name;
            name === 'manufactureContainer' ?
                Ext.Object.merge(result, item.diyGetValue()) :
                result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue();
        });
        return result;
    },
    diySetValue: function (data) {
        var me = this;
        var items = me.items.items;
        !Ext.Object.isEmpty(data) && items.forEach(item => item.diySetValue ? item.diySetValue(data) : item.setValue(data));
    },
    initComponent: function () {
        var me = this;
        var partnerId = JSGetQueryString('partnerId');
        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                margin: '0 0 0 10',
                handler: function (btn) {
                    var me = btn.ownerCt.ownerCt;
                    var jsonData = me.diyGetValue();
                    var manufactureId = me.controller.queryDataId;
                    me.controller.isPOST && delete jsonData['id'];
                    var url = me.controller.isPOST ? 'api/manufactures' : 'api/manufactures/' + manufactureId;
                    JSSetLoading(true);
                    JSAjaxRequest(adminPath + url, me.controller.isPOST ? 'POST' : 'PUT', false, jsonData, null, function (require, success, response) {
                        JSSetLoading(false);
                        if (success) {
                            var responseText = Ext.JSON.decode(response.responseText);
                            if (responseText.success) {
                                var data = responseText.data;
                                me.controller.isPOST = false;
                                me.controller.queryDataId = data._id;
                                me.diySetValue(data);
                            }
                        }
                    })
                }
            },
        ];
        me.items = [
            { //已完成所有功能
                xtype: 'manufacture_container',
                itemId: 'manufactureContainer',
                name: 'manufactureContainer',
                margin: '10 20 10 20',
                partnerId: partnerId,
            },
            { //已完成所有功能
                xtype: 'address_matcher',
                itemId: 'abstractAddressMatcher',
                name: 'abstractAddressMatcher',
                title: i18n.getKey('可支持生产地区管理'),
            },
            {
                xtype: 'product_of_manufacture',
                itemId: 'productOfManufacture',
                width: '100%',
                title: i18n.getKey('可支持产品管理'),
                controller: me.controller
            },
            {
                xtype: 'product_of_manufacture_v2',
                itemId: 'product_of_manufacture_v2',
                width: '100%',
                margin: '10',
                allowBlank: true,
                controller: me.controller,
                actionEditHidden: true,
            }
        ];
        me.callParent();
        me.diySetValue(me.queryData);
    }
})