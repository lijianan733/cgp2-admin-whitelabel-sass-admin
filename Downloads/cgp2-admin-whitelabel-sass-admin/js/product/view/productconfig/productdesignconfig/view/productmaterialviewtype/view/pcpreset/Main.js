/**
 * Created by nan on 2021/8/24
 * pc预配置，和pc预处理功能一样
 *
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpreset.view.EditForm',
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpreset.config.Config',
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpreset.store.PCPreSetStore'
])
Ext.Loader.setPath({
    enabled: true,
    "CGP.PCPreSet": path + 'js/product/view/productconfig/productdesignconfig/view/productmaterialviewtype/view/pcpreset'
});
Ext.onReady(function () {
    var store = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpreset.store.PCPreSetStore');
    // 创建一个GridPage控件
    var mvtId = JSGetQueryString('mvtId');
    var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpreset.controller.Controller');
    var pcsData = controller.getPCSData(mvtId);
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('PCPreSet'),
        block: 'PCPreSet',
        // 编辑页面
        editPage: 'edit.html',
        tbarCfg: {
            btnCreate: {
                handler: function (btn) {
                    console.log(btn);
                    var uxGrid = btn.ownerCt.ownerCt.ownerCt;
                    controller.editPCPreSet(null, pcsData, uxGrid);
                }
            }
        },
        listeners: {
            afterrender: function () {
                var page = this;
                var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
                var productId = builderConfigTab.productId;
                var isLock = JSCheckProductIsLock(productId);
                if (isLock) {
                    JSLockConfig(page);
                }
            }
        },
        gridCfg: {
            // store是指store.js
            store: store,
            frame: false,
            editActionHandler: function (gridview, rowIndex, colIndex, view, event, record, dom) {//编辑按钮的操作
                controller.editPCPreSet(record, pcsData, gridview.ownerCt.ownerCt);
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    itemId: '_id',
                }, {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    itemId: 'name',
                    width: 250
                }, {
                    text: i18n.getKey('type'),
                    dataIndex: 'clazz',
                    itemId: 'clazz',
                    flex: 1,
                    renderer: function (value, mateData, record) {
                        if (value == 'com.qpp.cgp.domain.theme.SinglePcResourceContent') {
                            return '每一个PC的同一位置应用同一资源'
                        } else if (value == 'com.qpp.cgp.domain.theme.RandomPcResourceContent') {
                            return '随机资源应用到PC的同一位置';
                        } else if (value == 'com.qpp.cgp.domain.theme.StaticMultiPcResourceContent') {
                            return '自定义规则指定PC位置和资源';
                        }
                    }
                }
            ]
        },

        // 查询输入框
        filterCfg: {
            items: [
                {
                    name: 'id',
                    xtype: 'textfield',
                    isLike: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },
                {
                    xtype: 'combo',
                    name: 'clazz',
                    itemId: 'clazz',
                    editable: false,
                    fieldLabel: i18n.getKey('type'),
                    valueField: 'value',
                    displayField: 'display',
                    matchFieldWidth: false,
                    isLike: false,
                    store: {
                        xtype: 'store',
                        fields: ['value', 'display'],
                        data: [
                            {
                                value: 'com.qpp.cgp.domain.theme.SinglePcResourceContent',
                                display: '每一个PC的同一位置应用同一资源'
                            },
                            {
                                value: 'com.qpp.cgp.domain.theme.RandomPcResourceContent',
                                display: '随机资源应用到PC的同一位置'
                            },
                            {
                                value: 'com.qpp.cgp.domain.theme.StaticMultiPcResourceContent',
                                display: '自定义规则指定PC位置和资源'
                            }
                        ]
                    },
                },
                {
                    name: 'mvt._id',
                    xtype: 'textfield',
                    hidden: true,
                    value: mvtId,
                    isLike: false,
                    itemId: 'mvt._id'
                },
            ]
        }
    });
});
