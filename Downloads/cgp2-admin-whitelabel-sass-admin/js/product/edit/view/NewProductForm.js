Ext.Loader.syncRequire([
    'CGP.common.field.WebsiteCombo'
]);
Ext.define("CGP.product.edit.view.NewProductForm", {
    extend: "Ext.form.Panel",
    title: '选择产品分类和产品类型',
    region: 'center',
    defaults: {
        style: 'margin: 20px',
        width: 300
    },

    initComponent: function () {
        var me = this;


        me.items = [
            {
                name: 'website',
                itemId: 'website',
                xtype: 'websitecombo',
                value: 11,
                hidden: true,
            },
            {
                name: 'mainCategory', //Mark,TreeCombo
                xtype: 'productcategorycombo',
                displayField: 'name',
                valueField: 'id',
                isMain: true,
                store: mainProductCategoryStore,
                selectChildren: false,
                canSelectFolders: true,
                defaultWebsite: 11,
                multiselect: false,
                useRawValue: true,
                fieldLabel: i18n.getKey('maincategory'),
                width: 300,
                blackText: '不能为空',
                itemId: 'mainCategory',
                allowBlank: false,
                editable: false
            },
            {
                fieldLabel: i18n.getKey('productType'),
                editable: false,
                name: 'inputType',
                xtype: 'combo',
                store: new Ext.data.Store({
                    fields: ['name', 'id'],
                    data: [
                        {
                            name: i18n.getKey('configurableProduct'),
                            id: 'Configurable'
                        },
                        {
                            name: i18n.getKey('skuProduct'),
                            id: 'Sku'
                        }
                    ]
                }),
                displayField: 'name',
                valueField: 'id',
                itemId: 'productType',
                allowBlank: false
            }
        ];
        me.listeners = {
            /**
             *包括主类目树的expand
             *在选择网站时，加载该网站的主类目和产品类目
             */
            afterrender: function (form) {
                var mainCategory = form.getComponent('mainCategory');
                mainCategory.tree.expandAll();

                var website = form.getComponent('website');
                website.on('select', function (combo, records) {
                    var websiteId = records[0].get('id');
                    mainCategory.reset();
                    mainCategory.websiteSelector.setValue(websiteId);
                    mainProductCategoryStore.proxy.extraParams.website = websiteId;
                    subProductCategoryStore.proxy.extraParams.website = websiteId;
                    /* mainProductCategoryStore.load({
                         callback: function () {
                             mainCategory.tree.expandAll();
                         }
                     });*/
                    subProductCategoryStore.load();
                })

            }
        };
        /**
         *点击 下一步 配置
         *首先检查本步骤是否配置完成
         *再根据产品类型的不同 进入 不同的配置步骤
         *1、  如果是Sku产品  跳过Sku属性的配置 直接进入通用属性配置
         *2、  如果是Configurable产品，不需要进行Sku属性的配置
         */
        me.bbar = [
            '->',
            {
                xtype: 'button',
                iconCls: 'icon_next_step',
                text: i18n.getKey('nextStep'),
                handler: function () {
                    var form = this.ownerCt.ownerCt;
                    //验证form
                    if (form.getForm().isValid()) {
                        me.controller.createProductNextStep(form);
                    }
                }
            }
        ];
        me.callParent(arguments);
    }
})
