/**
 * Created by nan on 2021/1/14
 * 配置日历预处理细节的配置表单
 */
Ext.Loader.syncRequire([
    'CGP.pagecontentschema.view.DisplayObjectEditForm'
])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.CalenderDetailConfigForm', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.calenderdetailconfigform',
    designId: null,
    isValidForItems: true,
    autoScroll: true,
    /*  layout: {
          type: 'hbox',
          columns: 3
      },
      defaults: {
          flex: 1,
          height: '100%',
      },
      bodyStyle: {
          margin: '0px'
      },*/
    layout: {
        type: 'vbox',
    },
    defaults: {
        allowBlank: true,
        msgTarget: 'side',
        width: 500,
        margin: '5 25 5 25'
    },
    title: i18n.getKey('日历配置'),
    isValid: function () {
        this.msgPanel.hide()
        var isValid = true,
            errors = {};
        if (this.rendered == true) {
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
        }
        return isValid;
    },
    initComponent: function () {
        var me = this;
        var opratorStore = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.store.OperatorStore');
        var monthImageGroupStore = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.store.MonthImageGroupStore');
        me.items = [
            {
                xtype: 'optionalconfigcontainer',
                allowBlank: false,
                title: '月份图配置',
                name: 'monthImageConfig',
                width: '100%',
                containerConfig: {
                    defaults: {
                        width: 500,
                        margin: '10 25 5 25',
                        allowBlank: true,
                    },
                },
                containerItems: [
                    {
                        xtype: 'jsonpathselectorfieldcontainer',
                        name: 'monthImageSelector',
                        itemId: 'monthImageSelector',
                        fieldLabel: i18n.getKey('月份图位置'),
                    },
                    {
                        xtype: 'valueexfield',
                        name: 'language',
                        fieldLabel: i18n.getKey('月份图文本语言'),
                        itemId: 'language'
                    },
                    {
                        xtype: 'valueexfield',
                        name: 'startMonth',
                        fieldLabel: i18n.getKey('初始月份'),
                        itemId: 'startMonth',
                        commonPartFieldConfig: {
                            defaultValueConfig: {
                                type: 'String',
                                typeSetReadOnly: true,
                            }
                        }
                    },
                    {
                        xtype: 'valueexfield',
                        name: 'total',
                        fieldLabel: i18n.getKey('月份总数'),
                        itemId: 'total',
                        commonPartFieldConfig: {
                            defaultValueConfig: {
                                type: 'Number',
                                typeSetReadOnly: true,
                            }
                        }
                    },
                    {
                        xtype: 'gridcombo',
                        name: 'monthImageGroup',
                        fieldLabel: i18n.getKey('month ImageGroup'),
                        itemId: 'monthImageGroup',
                        displayField: 'description',
                        store: monthImageGroupStore,
                        valueField: '_id',
                        allowBlank: true,
                        editable: false,
                        matchFieldWidth: false,
                        multiSelect: false,
                        gridCfg: {
                            store: monthImageGroupStore,
                            height: 450,
                            width: 400,
                            columns: [
                                {
                                    text: i18n.getKey('id'),
                                    width: 70,
                                    dataIndex: '_id'
                                },
                                {
                                    text: i18n.getKey('description'),
                                    dataIndex: 'description',
                                    flex: 1,
                                    renderer: function (value, metadata) {
                                        metadata.tdAttr = 'data-qtip="' + value + '"';
                                        metadata.style = "font-weight:bold";
                                        return value;
                                    }
                                }
                            ],
                            bbar: {
                                xtype: 'pagingtoolbar',
                                store: monthImageGroupStore,
                                displayInfo: true,
                                displayMsg: 'Displaying {0} - {1} of {2}',
                                emptyMsg: i18n.getKey('noData')
                            }
                        }
                    }
                ]
            },
            {
                //每一项都是必填项
                xtype: 'optionalconfigcontainer',
                allowBlank: true,
                initExpand: false,
                name: 'dataCellConfig',
                width: '100%',
                margin: '10 25 5 25',
                title: i18n.getKey('日期格子配置'),
                containerConfig: {
                    defaults: {
                        width: 500,
                        margin: '10 25 5 25',
                        allowBlank: true
                    },
                },
                containerItems: [
                    {
                        xtype: 'combo',
                        name: 'firstDateOfWeek',
                        fieldLabel: i18n.getKey('firstDateOfWeek'),
                        valueField: 'value',
                        displayField: 'display',
                        editable: false,
                        itemId: 'firstDateOfWeek',
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                'value', 'display'
                            ],
                            data: [
                                {
                                    value: 0,
                                    display: i18n.getKey('sunday')
                                },
                                {
                                    value: 1,
                                    display: i18n.getKey('monday')
                                }
                            ]
                        })
                    },
                    {
                        xtype: 'jsonpathselectorfieldcontainer',
                        name: 'monthContainerSelector',
                        itemId: 'monthContainerSelector',
                        fieldLabel: i18n.getKey('日期格子位置'),
                    },
                    {
                        xtype: 'numberfield',
                        name: 'dateRowSpacing',
                        itemId: 'dateRowSpacing',
                        minValue: 0,
                        allowDecimals: false,
                        fieldLabel: i18n.getKey('日期格子行间距'),
                    },
                    {
                        xtype: 'numberfield',
                        name: 'dateColumnSpacing',
                        itemId: 'dateColumnSpacing',
                        minValue: 0,
                        allowDecimals: false,
                        fieldLabel: i18n.getKey('日期格子列间距'),
                    },
                    {
                        xtype: 'textarea',
                        name: 'holidaySelector',
                        itemId: 'holidaySelector',
                        rows: 1,
                        grow: true,
                        maxHeight: 100,
                        emptyText: '根据日期格子内容模板来配置的JsonPath',
                        fieldLabel: i18n.getKey('假期位置'),
                    },
                    {
                        xtype: 'valueexfield',
                        name: 'holidayNation',
                        itemId: 'holidayNation',
                        fieldLabel: i18n.getKey('假期所属国家'),
                    },
                    {
                        xtype: 'uxfieldcontainer',
                        itemId: 'holidayElementOperatorConfig',
                        name: 'holidayElementOperatorConfig',
                        layout: 'hbox',
                        allowBlank: true,
                        labelAlign: 'left',
                        defaults: {},
                        fieldLabel: i18n.getKey('data') + i18n.getKey('operator'),
                        items: [
                            {
                                fieldLabel: false,
                                store: opratorStore,
                                multiSelect: false,
                                valueField: '_id',
                                displayField: 'displayName',
                                editable: false,
                                xtype: 'gridcombo',
                                haveReset: true,
                                allowBlank: false,
                                itemId: 'operator',
                                id: 'operator',
                                name: 'operator',
                                padding: '0 10 0 0',
                                flex: 2,
                                matchFieldWidth: false,
                                gridCfg: {
                                    store: opratorStore,
                                    width: 450,
                                    height: 280,
                                    columns: [
                                        {
                                            text: i18n.getKey('description'),
                                            flex: 1,
                                            dataIndex: 'description',
                                            renderer: function (value, matete, record) {
                                                return value + '(' + record.getId() + ')';
                                            }
                                        }
                                    ],
                                    tbar: {
                                        layout: {
                                            type: 'column'
                                        },
                                        defaults: {
                                            width: 170,
                                            isLike: false,
                                            padding: 2
                                        },
                                        items: [
                                            {
                                                xtype: 'textfield',
                                                fieldLabel: i18n.getKey('id'),
                                                name: '_id',
                                                isLike: false,
                                                labelWidth: 40
                                            },
                                            {
                                                xtype: 'textfield',
                                                fieldLabel: i18n.getKey('description'),
                                                name: 'description',
                                                labelWidth: 40
                                            }, {
                                                xtype: 'textfield',
                                                fieldLabel: i18n.getKey('sourceType'),
                                                hidden: true,
                                                value: 'Target',
                                                name: 'sourceType',
                                                labelWidth: 40
                                            },
                                            '->',
                                            {
                                                xtype: 'button',
                                                text: i18n.getKey('search'),
                                                handler: me.searchParams,
                                                width: 80
                                            },
                                            {
                                                xtype: 'button',
                                                text: i18n.getKey('clear'),
                                                handler: me.clearParams,
                                                width: 80
                                            }
                                        ]
                                    },
                                    bbar: Ext.create('Ext.PagingToolbar', {
                                        store: opratorStore,
                                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                                        emptyMsg: i18n.getKey('noData')
                                    })
                                }
                            },
                            {
                                xtype: 'button',
                                flex: 1,
                                text: i18n.getKey('edit'),
                                handler: function (button) {
                                    var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.controller.Controller');
                                    var operator = button.ownerCt.getComponent('operator');
                                    controller.editOperator(me.createOrEdit, operator);
                                }
                            }
                        ],
                        diySetValue: function (data) {
                            var me = this;
                            if (data && data._id) {
                                me.getComponent('operator').setInitialValue([data._id]);
                            }
                            //me.getComponent('operator').setValue(data._id);
                        },
                        isValid: function () {
                            var me = this;
                            var operator = me.getComponent('operator');
                            if (me.allowBlank == true) {
                                return true;
                            } else {
                                return operator.isValid();
                            }
                        },
                        diyGetValue: function () {
                            var me = this;
                            var operatorId = '';
                            for (var i in me.getComponent('operator').getValue()) {
                                operatorId = i;
                            }
                            if (operatorId) {
                                return {
                                    _id: operatorId,
                                    clazz: 'com.qpp.cgp.domain.preprocess.operator.SourceOperatorConfig'
                                };
                            } else {
                                return null;
                            }
                        }
                    }
                ]
            },
        ];
        me.callParent();
    },
    getValue: function () {
        var me = this;
        var result = {};
        if (me.rendered == true) {
            for (var i = 0; i < me.items.items.length; i++) {
                Ext.Object.merge(result, me.items.items[i].getValue());
            }
            return result;
        } else {
            return me.rawData;
        }
    },
    setValue: function (data) {
        var me = this;
        me.rawData = Ext.clone(data);
        //需要排除的字段
        var excludeField = ['background', 'clazz', 'description', 'designId', 'layout', 'runWhenInit', 'targetMaterialViewType'];
        //去除基础信息里的字段
        for (var i = 0; i < excludeField.length; i++) {
            delete me.rawData[excludeField[i]];
        }
        if (me.rendered == true) {
            for (var i = 0; i < me.items.items.length; i++) {
                var item = me.items.items[i];
                if (item.name == 'dateElementTemplate') {
                    item.setValue(data['dateElementTemplate']);
                } else if (item.name == 'dataCellConfig') {
                    item.setValue(data);
                } else {
                    item.setValue(data);
                }
            }
        } else {
            me.on('afterrender', function () {
                me.setValue(me.rawData);
            })
        }
    }
})
