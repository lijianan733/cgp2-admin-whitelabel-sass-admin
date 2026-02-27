Ext.define('CGP.product.edit.module.Information', {
    extend: 'Ext.ux.form.Panel',


    constructor: function (data) {
        var me = this;
        me.data = data;
        var websiteId = me.data.websiteId ? me.data.websiteId : me.data.mainCategory.website;
        console.log(me.data)
        var applyConfig = {
            title: i18n.getKey('information'),
            columnCount: 1,
            model: 'CGP.model.Product',
            items: [
                {
                    name: 'id',
                    xtype: 'numberfield',
                    readOnly: true,
                    fieldStyle: 'background-color: silver',//设置文本框的样式
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id',
                    listeners: {
                        afterrender: function () {
                            this.setVisible(this.ownerCt.getCurrentMode() == 'editing');
                        }
                    }
                },
                {
                    name: 'type',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('type'),
                    itemId: 'type',
                    value: data.type,
                    readOnly: true
                }, {
                    name: 'mode',
                    xtype: 'combo',
                    editable: false,
                    allowBlank: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name', 'value'],
                        data: [{name: '正式', value: 'RELEASE'}, {name: '测试', value: 'TEST'}]
                    }),
                    displayField: 'name',
                    value: 'TEST',
                    valueField: 'value',
                    queryMode: 'local',
                    fieldLabel: i18n.getKey('productMode'),
                    itemId: 'mode',
                    listeners: {
                        afterrender: function () {
                            this.setVisible(this.ownerCt.getCurrentMode() != 'editing');
                        }
                    }
                },
                {
                    name: 'model',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('model'),
                    itemId: 'model',
                    allowBlank: false
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name',
                    allowBlank: false
                },
                {
                    name: 'dateAvailable',
                    xtype: 'datefield',
                    fieldLabel: i18n.getKey('enabledDate'),
                    itemId: 'dateAvailable',
                    format: 'Y-m-d',
                    allowBlank: false,
                    value: new Date()
                },
                {
                    name: 'builderType',
                    xtype: 'combo',
                    editable: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['title', 'value'],
                        data: [
                            {
                                title: 'H5',
                                value: 'H5'
                            },
                            {
                                title: 'FLASH',
                                value: 'FLASH'
                            },
                            {
                                title: 'QPP',
                                value: 'QPP'
                            },
                            {
                                title: 'CHILI',
                                value: 'CHILI'
                            },
                            {
                                title: 'UF2-PV-ONLY',
                                value: 'UF2-PV-ONLY'
                            }, {
                                title: "COMPATIBILITY",
                                value: "COMPATIBILITY"
                            }, {
                                title: 'DynamicSize',
                                value: 'DynamicSize'
                            }
                        ]
                    }),
                    valueField: 'value',
                    displayField: 'title',
                    fieldLabel: i18n.getKey('builderType'),
                    itemId: 'builderType'
                },
                {
                    name: 'lowestPrice',
                    fieldLabel: i18n.getKey('lowestPrice'),
                    xtype: 'textfield',
                    allowDecimals: true,
                    maskRe: /[\d,\.]/,//只能输入数值
                    decimalAutoType: true,//不自动缩减0
                    decimalPrecision: 2,//这里设置保留2为小数
                    hideTrigger: true,
                    itemId: 'lowestPrice',
                    allowBlank: true,
                },
                {
                    name: 'salePrice',
                    fieldLabel: i18n.getKey('salePrice'),
                    xtype: 'textfield',
                    allowDecimals: true,
                    maskRe: /[\d,\.]/,//只能输入数值
                    decimalAutoType: true,//不自动缩减0
                    decimalPrecision: 2,//这里设置保留2为小数
                    hideTrigger: true,
                    itemId: 'salePrice',
                    allowBlank: false
                },
                {
                    fieldLabel: i18n.getKey('priceRule'),
                    xtype: 'fieldcontainer',
                    name: 'priceRules',
                    itemId: 'priceRules',
                    store: Ext.create('CGP.product.store.PriceRule', {
                        data: []
                    }),
                    getValue: function () {
                        var rs = [];
                        if (this.store) {
                            this.store.each(function (record) {
                                rs.push(record.getData());
                            })
                        }
                        return rs;
                    },
                    setValue: function (priceData) {

                        this.store = Ext.create('CGP.product.store.PriceRule', {
                            productId: me.data.id || ''
                        });
                    },
                    items: [
                        {
                            xtype: 'button',
                            text: '查看规则',
                            handler: function () {
                                var seft = this.ownerCt;
                                Ext.create('CGP.product.view.pricerule.ListWindow', {
                                    productId: me.data.id || '',
                                    store: seft.store
                                }).show();
                            }
                        }
                    ]
                },
                {
                    name: 'moq',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('minBuyQuantity'),
                    hideTrigger: true,
                    itemId: 'moq',
                    allowBlank: false
                },
                {
                    name: 'weight',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('weight'),
                    hideTrigger: true,
                    itemId: 'weight',
                    allowBlank: false
                },
                {
                    name: 'bindProductId',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('bindProductId'),
                    hideTrigger: true,
                    itemId: 'bindProductId'
                },
                {
                    name: 'status',
                    xtype: 'combo',
                    editable: false,
                    allowBlank: false,
                    value: 1,
                    hidden: true,
                    fieldLabel: i18n.getKey('status'),
                    itemId: 'status',
                    store: new Ext.data.Store({
                        fields: ['name', {
                            name: 'id',
                            type: 'int'
                        }],
                        data: [
                            {
                                name: 'active',
                                id: 1
                            },
                            {
                                name: 'inactive',
                                id: 2
                            }
                        ]

                    }),
                    displayField: 'name',
                    valueField: 'id'
                },
                {
                    name: 'invisible',
                    value: 'false',
                    xtype: 'combo',
                    editable: false,
                    required: true,
                    hidden: true,
                    fieldLabel: i18n.getKey('invisible'),
                    itemId: 'invisible',
                    store: new Ext.data.ArrayStore({
                        fields: ['name'],
                        data: [
                            [true],
                            [false]
                        ]

                    }),
                    displayField: 'name',
                    valueField: 'name',
                    allowBlank: false
                },
                {
                    name: 'subCategories', //Mark,TreeCombo
                    xtype: 'productcategorycombo',
                    displayField: 'name',
                    valueField: 'id',
                    isMain: false,
                    allowBlank: true,
                    store: Ext.data.StoreManager.lookup('subProductCategoryStore'),
                    selectChildren: false,
                    canSelectFolders: false,
                    hidden: true,
                    websiteSelectorEditable: false,
                    defaultWebsite: websiteId,
                    multiselect: true,
                    fieldLabel: i18n.getKey('subcategory'),
                    width: 380,
                    blackText: '不能为空',
                    itemId: 'subCategories',
                    editable: false,
                    diyGetValue: function () {
                        console.log(this.getValue())
                        return this.getValue();
                    }
                },
                {
                    name: 'shortDescription',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('shortDescription'),
                    width: 380,
                    itemId: 'shortDescription',
                    style: 'margin:20px'
                },
                {
                    name: 'description1',
                    width: 900,
                    xtype: 'htmleditor',
                    fieldLabel: i18n.getKey('description1'),
                    itemId: 'description1',
                    style: 'margin:20px',
                    plugins: [Ext.create('Ext.ux.form.HtmlEditor.Table'),
                        Ext.create('Ext.ux.form.HtmlEditor.Image'), Ext.create('Ext.ux.form.HtmlEditor.RemoveFormat'), Ext.create('Ext.ux.form.HtmlEditor.Maximize', {
                            htmleditor: this,
                            editorItemId: 'description1'
                        })]
                },
                {
                    name: 'description2',
                    width: 900,
                    xtype: 'htmleditor',
                    fieldLabel: i18n.getKey('description2'),
                    itemId: 'description2',
                    style: 'margin:20px',
                    plugins: [Ext.create('Ext.ux.form.HtmlEditor.Maximize', {
                        htmleditor: this,
                        editorItemId: 'description2'
                    })]
                },
                {
                    name: 'description3',
                    width: 900,
                    xtype: 'htmleditor',
                    fieldLabel: i18n.getKey('description3'),
                    itemId: 'description3',
                    style: 'margin:20px',
                    plugins: [Ext.create('Ext.ux.form.HtmlEditor.Maximize', {
                        htmleditor: this,
                        editorItemId: 'description3'
                    })]
                }
            ],
            listeners: {
                afterrender: function (form) {
                    var subCategories = form.getComponent('subCategories');
                    //var compositeIdTree = form.getComponent("compositeIdTree");

                    //compositeIdTree.tree.expandAll();
                    //compositeIdTree.tree.collapseAll();

                    subCategories.tree.expandAll();
                }
            }
        };


        me.callParent([applyConfig]);
        me.content = me;
    },

    validateForm: function () {
        var me = this;
        if (!me.isValid()) {
            Ext.Msg.alert('WARN', 'Requeied infomation must not be blank!');
            //throw new Error('Requeied infomation must not be blank!');
        }
    },

    getValue: function () {
        var me = this;
        me.validateForm();
        var value = me.form.getValuesByModel('CGP.model.Product');
        var ids = value.subCategories;
        value.subCategories = [];
        Ext.Array.each(ids, function (id) {
            value.subCategories.push({
                id: Ext.Number.from(id)
            })
        })
        value.priceRules = me.getComponent('priceRules').getValue();
        return value;
    },

    setValue: function (data) {
        var me = this;
        me.data = data;
        if (Ext.isArray(data.subCategories)) {
            var ids = [];
            Ext.Array.each(data.subCategories, function (subCategory) {
                ids.push(subCategory.id);
            })

            data.subCategories = ids.join(',');
        }
        var modelData = new CGP.model.Product(data);
        me.form.setValuesByModel(modelData);
        me.getComponent('priceRules').setValue(data.priceRules);
        if (data.subCategories) {
            me.getComponent('subCategories').setInitialValue(data.subCategories.split(','));

        }
    },

    copy: function (data) {
        var me = this;
        me.getComponent('id').setValue("");
        data.id = null;
    }

});
