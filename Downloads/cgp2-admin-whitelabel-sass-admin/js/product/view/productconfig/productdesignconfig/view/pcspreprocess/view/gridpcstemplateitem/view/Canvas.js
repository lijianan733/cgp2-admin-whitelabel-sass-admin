/**
 * Created by nan on 2021/5/25
 */
Ext.Loader.syncRequire([
    'CGP.pagecontentschema.view.canvas.view.EditCanvasFrom'
])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.view.gridpcstemplateitem.view.Canvas', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.canvas',
    autoScroll: true,
    createOrEdit: 'create',
    canvasStore: null,
    defaults: {
        allowBlank: false,
        width: 350,
        margin: '5 25 5 25',
    },
    isValidForItems: true,//是否校验时用item.forEach来处理
    title: i18n.getKey('Canvas'),
    listeners: {
        afterrender: function () {
            var page = this;
            var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
            var productId = builderConfigTab.productId;
            var isLock = JSCheckProductIsLock(productId);
            page.builderConfigTab = builderConfigTab;
            if (isLock) {
                JSLockConfig(page);
            }

        }
    },
    pcsConfigData: null,
    pageContentSchemaId: null,
    isValid: function () {
        var me = this;
        if (me.rendered == false) {
            //初始时没规定disabled,故用是否有rawData;
            return true;
        }
        if (me.disabled == true) {
            return true;
        } else {
            this.msgPanel.hide();
            var isValid = true,
                errors = {};
            if (me.rendered == false && !Ext.isEmpty(me.rawData)) {
                return true;
            } else {
                this.items.items.forEach(function (f) {
                    if (!f.isValid()) {
                        var errorInfo = f.getErrors();
                        if (Ext.isObject(errorInfo) && !Ext.Object.isEmpty(errorInfo)) {//处理uxfieldContainer的错误信息
                            errors = Ext.Object.merge(errors, errorInfo);
                        } else {
                            errors[f.getFieldLabel()] = errorInfo;
                        }
                        isValid = false;
                    }
                });
                isValid ? null : this.showErrors(errors);
                return isValid;
            }
        }
    },
    diyGetValue: function () {
        var me = this;
        if (me.rendered == true) {
            var data = me.getValue();
            if (Ext.isEmpty(data) || Ext.Object.isEmpty(data)) {
                return {
                    canvas: null
                };
            } else {
                return {
                    canvas: data
                };
            }
        } else {
            return {
                canvas: me.rawData
            }
        }
    },
    diySetValue: function (data) {
        var me = this;
        if (data) {
            me.rawData = data.canvas;
            if (me.rawData) {
                if (me.rendered == false) {
                    me.on('afterrender', function () {
                        me.setValue(me.rawData);
                    })
                } else {
                    me.setValue(me.rawData);
                }
            }
        }
    },
    /**
     * 使用pcs中的canvas列表中的数据
     */
    importFormPCS: function (pcs, canvasForm) {
        var me = this;
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            constrain: true,
            width: 600,
            height: 400,
            title: i18n.getKey('select') + i18n.getKey('canvas'),
            layout: {
                type: 'fit'
            },
            items: [
                {
                    xtype: 'grid',
                    store: Ext.create('Ext.data.Store', {
                        model: 'CGP.pagecontentschema.view.canvas.model.Canvas',
                        data: pcs.canvases || [],
                        proxy: {
                            type: 'memory'
                        }
                    }),
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            dataIndex: '_id',
                            itemId: '_id',
                        },
                        {
                            text: i18n.getKey('description'),
                            dataIndex: 'description',
                            width: 250,
                            itemId: 'description',
                        },
                        {
                            text: i18n.getKey('containPath'),
                            dataIndex: 'containPath',
                            itemId: 'containPath',
                            xtype: 'componentcolumn',
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip=' + i18n.getKey('check') + i18n.getKey('containPath');
                                return {
                                    xtype: 'displayfield',
                                    value: '<a href="#" style="color: blue" )>' + i18n.getKey('containPath') + '</a>',
                                    listeners: {
                                        render: function (display) {
                                            var a = display.el.dom.getElementsByTagName('a')[0];//获取到该html元素下的a元素
                                            var ela = Ext.fly(a);//获取到a元素的element封装对象
                                            ela.on("click", function () {
                                                JSShowJsonDataV2(value, i18n.getKey('check') + i18n.getKey('containPath'), {})
                                            });
                                        }
                                    }
                                };
                            }
                        },
                        {
                            text: i18n.getKey('constraints'),
                            dataIndex: 'constraints',
                            itemId: 'constraints',
                            xtype: 'componentcolumn',
                            flex: 1,
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip=' + i18n.getKey('check') + i18n.getKey('constraints');
                                return {
                                    xtype: 'displayfield',
                                    value: '<a href="#" style="color: blue" )>' + i18n.getKey('constraints') + '</a>',
                                    listeners: {
                                        render: function (display) {
                                            var a = display.el.dom.getElementsByTagName('a')[0];//获取到该html元素下的a元素
                                            var ela = Ext.fly(a);//获取到a元素的element封装对象
                                            ela.on("click", function () {
                                                JSShowJsonDataV2({constraints: value}, i18n.getKey('check') + i18n.getKey('constraints'), {})
                                            });
                                        }
                                    }
                                };
                            }
                        }
                    ]
                }
            ],
            bbar: [
                '->',
                {
                    text: i18n.getKey('confirm'),
                    itemId: 'okBtn',
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var grid = win.items.items[0];
                        var selection = grid.getSelectionModel().getSelection()
                        if (selection.length > 0) {
                            canvasForm.setValue(selection[0].raw);
                            win.close();
                        }
                    }
                }, {
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        win.close();
                    }
                }
            ]
        });
        win.show();

    },
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.controller.Controller');
        me.items = [
            {
                name: 'selector',
                xtype: 'valueexfield',
                fieldLabel: i18n.getKey('selector'),
                itemId: 'selector',
                commonPartFieldConfig: {
                    expressionConfig: {
                        value: "function expression(input){" +
                            "var itemQty= input.context.itemQty;" +
                            "var titleArray = [];" +
                            "for(var i = 0;i < itemQty;i++){" +
                            "titleArray.push('$.layers[0].items['+i+'].items[0]')" +
                            "}" +
                            "return titleArray}",
                    },
                    defaultValueConfig: {
                        type: 'Array',
                        clazz: 'com.qpp.cgp.value.ExpressionValueEx',
                        typeSetReadOnly: true,
                        clazzSetReadOnly: false
                    }
                },
            },
            {
                name: 'operationType',
                xtype: 'combo',
                fieldLabel: i18n.getKey('operationType'),
                itemId: 'operationType',
                valueField: 'value',
                displayField: 'display',
                editable: false,
                value: 'Replace',
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        'value', 'display'
                    ],
                    data: [
                        {
                            value: 'Replace',
                            display: i18n.getKey('Replace')
                        },
                        {
                            value: 'Append',
                            display: i18n.getKey('Append')
                        }
                    ]
                })
            },
            {
                xtype: 'toolbar',
                color: 'black',
                width: '100%',
                height: 33,
                bodyStyle: 'border-color:white;',
                border: '0 0 1 0',
                itemId: 'pagePCGenerateConfigToolBar',
                layout: {
                    type: 'hbox',
                    align: 'left',
                    pack: 'left'

                },
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: false,
                        value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('canvas') + '</font>'
                    },
                    {
                        xtype: 'button',
                        margin: '0 5 0 10',
                        itemId: 'button',
                        iconCls: 'icon_import',
                        text: i18n.getKey('使用PCS中的canvas'),
                        handler: function (btn) {
                            //
                            var canvasPanel = btn.ownerCt.ownerCt;
                            var canvasForm = canvasPanel.getComponent('canvasForm');
                            canvasPanel.importFormPCS(me.pcsConfigData, canvasForm);
                            console.log(me.pcsConfigData);
                        }
                    },
                ],
                getValue: function () {
                    return null;
                },
                setValue: function () {
                },
                getFieldLabel: function () {
                    return null
                },
                getName: function () {
                    return 'toolbar';
                },
                isValid: function () {
                    return true;
                }
            },
            {
                xtype: 'editcanvasform',
                recordId: null,
                border: false,
                width: '100%',
                flex: 1,
                itemId: 'canvasForm',
                defaults: {
                    allowBlank: false,
                    width: 500,
                    margin: '5 0 5 0'
                },
                isValid: function () {
                    var isValid = true,
                        errors = {};
                    /*     this.form.getFields().each(function (f) {
                             if (!f.isValid()) {
                                 isValid = false;
                                 errors[f.getFieldLabel()] = f.getErrors();
                             }
                         });*/
                    return isValid;
                },
                getErrors: function () {
                    return 'canvas数据必须完整'
                },
                getFieldLabel: function () {
                    var me = this;
                    return i18n.getKey('canvas');
                },
                getName: function () {
                    return 'canvas';
                },
                pageContentSchemaId: me.pageContentSchemaId,
                listeners: {
                    afterrender: function () {
                        var form = this;
                        var containPath = form.getComponent('containPath');
                        var id = form.getComponent('_id');
                        containPath.hide();
                        containPath.setDisabled(true);
                        id.hide();
                        id.setDisabled(true);
                    }
                }
            },
        ];
        me.callParent();
    }
})