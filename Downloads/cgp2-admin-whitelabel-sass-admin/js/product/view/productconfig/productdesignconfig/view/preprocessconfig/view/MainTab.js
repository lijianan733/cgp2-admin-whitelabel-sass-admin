/**
 * Created by nan on 2021/1/8
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.CustomizedPreprocessConfigGrid',
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.SpecialPreprocessConfigPanel',
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.Main'
])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.MainTab', {
    extend: 'Ext.tab.Panel',
    builderConfigTab: null,//产品配置的tab
    designId: null,
    initComponent: function () {
        var me = this;
        var builderConfigTab = me.builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
        var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.controller.Controller');
        me.items = [
            {
                xtype: 'customizedpreprocessconfiggrid',
                title: i18n.getKey('自定义预处理'),
                builderConfigTab: builderConfigTab,
                controller: controller,
                designId: me.designId,
            },
            {
                xtype: 'specialpreprocessconfigpanel',
                title: i18n.getKey('特例化预处理'),
                builderConfigTab: builderConfigTab,
                controller: controller,
                designId: me.designId,
            },
            {
                xtype: 'simplifytype',
                title: i18n.getKey('简化类型预处理'),
                builderConfigTab: builderConfigTab,
                controller: controller,
                designId: me.designId,
            }
        ];
        me.tbar = {
            items: [
                {
                    xtype: 'button',
                    itemId: 'defalutAdd',
                    text: i18n.getKey('add'),
                    iconCls: 'icon_add',
                    menu: {
                        items: [{
                            text: '自定义预处理配置',
                            handler: function (btn) {
                                var outerBtn = btn.ownerCt.ownerButton;
                                var tab = outerBtn.ownerCt.ownerCt;
                                tab.builderConfigTab.editMaterialViewTypePreProcessConfig(tab.designId, null, 'create', 'MaterialViewTypePreprocessConfig');
                            }
                        }, {
                            text: '日历预处理配置',
                            handler: function (btn) {
                                var outerBtn = btn.ownerCt.ownerButton;
                                var tab = outerBtn.ownerCt.ownerCt;
                                tab.builderConfigTab.editMaterialViewTypePreProcessConfig(tab.designId, null, 'create', 'CalenderPreprocessConfig');
                            }
                        }, {
                            text: '随机布局预处理配置',
                            handler: function (btn) {
                                var outerBtn = btn.ownerCt.ownerButton;
                                var tab = outerBtn.ownerCt.ownerCt;
                                tab.builderConfigTab.editMaterialViewTypePreProcessConfig(tab.designId, null, 'create', 'RandomLayoutPreprocessConfig');
                            }
                        }, {
                            text: '随机背景预处理配置',
                            handler: function (btn) {
                                var outerBtn = btn.ownerCt.ownerButton;
                                var tab = outerBtn.ownerCt.ownerCt;
                                tab.builderConfigTab.editMaterialViewTypePreProcessConfig(tab.designId, null, 'create', 'RandomBackgroundPreprocessConfig');
                            }
                        }, {
                            text: '随机内容预处理配置',
                            handler: function (btn) {
                                var outerBtn = btn.ownerCt.ownerButton;
                                var tab = outerBtn.ownerCt.ownerCt;
                                tab.builderConfigTab.editMaterialViewTypePreProcessConfig(tab.designId, null, 'create', 'RandomContentPreprocessConfig');
                            }
                        }]
                    },

                },
                {
                    xtype: 'button',
                    itemId: 'simplifyAdd',
                    text: i18n.getKey('add'),
                    iconCls: 'icon_add',
                    hidden: true,
                    menu: {
                        items: [
                            {
                                text: '顺序填充-单层结构Grid-单PC',
                                handler: function (btn) {
                                    var outerBtn = btn.ownerCt.ownerButton;
                                    var tab = outerBtn.ownerCt.ownerCt;
                                    tab.builderConfigTab.editSimplifyPreProcess(tab.designId,null,'OrderFillSingleStructGridSingle');
                                }
                            },
                            {
                                text: '顺序填充-单层结构 MVT多对一',
                                handler: function (btn) {
                                    var outerBtn = btn.ownerCt.ownerButton;
                                    var tab = outerBtn.ownerCt.ownerCt;
                                    tab.builderConfigTab.editSimplifyPreProcess(tab.designId,null,'OrderFillSingleStruct');
                                }
                            },
                            {
                                text: '顺序填充(PC替换PC)MVT多对一',
                                handler: function (btn) {
                                    var outerBtn = btn.ownerCt.ownerButton;
                                    var tab = outerBtn.ownerCt.ownerCt;
                                    tab.builderConfigTab.editSimplifyPreProcess(tab.designId,null,'OrdeFillSingle');
                                }
                            },
                            {
                                text: '顺序填充(PC替换PC)MVT一对一',
                                handler: function (btn) {
                                    var outerBtn = btn.ownerCt.ownerButton;
                                    var tab = outerBtn.ownerCt.ownerCt;
                                    tab.builderConfigTab.editSimplifyPreProcess(tab.designId,null,'OrderFillMultiContainer');
                                }
                            },
                            {
                                text: '顺序填充-单层结构Grid-多PC',
                                handler: function (btn) {
                                    var outerBtn = btn.ownerCt.ownerButton;
                                    var tab = outerBtn.ownerCt.ownerCt;
                                    tab.builderConfigTab.editSimplifyPreProcess(tab.designId,null,'OrderSingleFillGridMultiple');
                                }
                            },
                            {
                                text: '循环填充-单层级结构Grid MVT多对一',
                                handler: function (btn) {
                                    var outerBtn = btn.ownerCt.ownerButton;
                                    var tab = outerBtn.ownerCt.ownerCt;
                                    tab.builderConfigTab.editSimplifyPreProcess(tab.designId,null,'CycleFillGrid');
                                }
                            }
                        ]
                    },

                }
            ],
        };
        me.callParent();
        me.on('afterrender', function () {
            var page = this;
            var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
            var productId = builderConfigTab.productId;
            var isLock = JSCheckProductIsLock(productId);
            if (isLock) {
                JSLockConfig(page);
            }
        });
    },
    listeners: {
        tabchange: function (tabPanel, newCard, oldCard,) {
            var toolBar = tabPanel.getDockedItems('toolbar[dock="top"]')[0];
            var defalutAdd = toolBar.getComponent('defalutAdd');
            var simplifyAdd = toolBar.getComponent('simplifyAdd');
            if (newCard.xtype == 'simplifytype') {
                simplifyAdd.enable();
                simplifyAdd.show();
                defalutAdd.hide();
                defalutAdd.disable();
            } else {
                defalutAdd.enable();
                defalutAdd.show();
                simplifyAdd.hide();
                simplifyAdd.disable();
            }
        }
    }
})