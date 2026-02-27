/**
 * Created by nan on 2018/6/26.
 */
Ext.define('CGP.product.view.batchgenerateskuproduct.view.ShowAttributWindow', {
    extend: 'Ext.window.Window',
    title: i18n.getKey('generate') + i18n.getKey('skuProduct'),
    height: 500,
    width: 700,
    minWidth: 700,
    modal: true,
    autoScroll: true,
    maximizable: true,
    layout: 'fit',
    initComponent: function () {
        var me = this;
        var rawData = {};//源数据
        var controller = Ext.create('CGP.product.view.batchgenerateskuproduct.controller.Controller');
        /*        Ext.Ajax.request({
                    url: adminPath + 'api/products/configurable/' + me.productId + '/skuAttributes',
                    method: 'GET',
                    async: false,
                    headers: {
                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                    },
                    callback: function (options, success, response) {
                        var resp = eval('(' + response.responseText + ')');
                        rawData = resp.data;
                        var skuAttributeArr = resp.data;
                        var buttonDisable = controller.buttonIsDisableOrNot(rawData);
                        var items = controller.createFormItemConfig(rawData);
                        var form = Ext.create('Ext.form.Panel', {
                            autoScroll: true,
                            layout: {
                                type: 'vbox',
                                padding: '7 10 7 10',
                                align: 'stretch'
                            },
                            defaults: {
                                padding: '2 0 2 0'
                            },
                            listeners: {
                                validitychange: function (form, isValid) {
                                    var form = this;
                                    var tbar = form.getDockedItems('toolbar[dock="top"]')[0];
                                   ;
                                    if (isValid) {
                                        var batchGenerateButton = tbar.getComponent('batchGenerateButton');
                                        batchGenerateButton.setDisabled(false);
                                    } else {
                                        var batchGenerateButton = tbar.getComponent('batchGenerateButton');
                                        batchGenerateButton.setDisabled(true);
                                    }
                                }
                            },
                            tbar: [
                                /!* {
                                 xtype: 'button',
                                 disabled: buttonDisable,
                                 text: i18n.getKey('batch') + i18n.getKey('generate') + i18n.getKey('skuProduct'),
                                 iconCls: 'icon_batch',
                                 handler: function (view) {
                                 var root = {id: 0, name: 'root', optionId: 'root', children: []};
                                 controller.createTreeData(0, root, skuAttributeArr);
                                 var paths = controller.createAttributeValues(root);
                                 controller.batchGenerateSkuProduct(form, paths, me.productId);
                                 }
                                 },*!/
                                {
                                    xtype: 'button',
                                    disabled: buttonDisable,
                                    text: i18n.getKey('以选定值') + i18n.getKey('generate') + i18n.getKey('skuProduct'),
                                    iconCls: 'icon_batch',
                                    itemId: 'batchGenerateButton',
                                    handler: function (view) {
                                        var form = view.ownerCt.ownerCt;
                                        var root = {id: 0, name: 'root', optionId: 'root', children: []};
                                        if (skuAttributeArr.length > 0) {//有些可配置产品无sku属性存在
                                            controller.createTreeData(form, 0, root, skuAttributeArr);
                                            var paths = controller.createAttributeValues(root);
                                            controller.batchGenerateSkuProduct(form, paths, me.productId);
                                        }
                                    }
                                }
                            ],
                            items: items
                        });
                        me.form = form;
                    }
                })*/
        var form = Ext.create('CGP.product.view.batchgenerateskuproduct.view.SkuAttributeForm', {
            configurableProductId: me.productId
        });
        me.items = [form];
        me.callParent(arguments);
    }
})
