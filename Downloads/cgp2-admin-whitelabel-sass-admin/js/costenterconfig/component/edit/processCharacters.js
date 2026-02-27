Ext.syncRequire(['CGP.costenterconfig.method.method']);

Ext.define('CGP.costenterconfig.component.edit.processCharacters', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.processcharacters',
    layout: {
        type: 'table',
        columns: 2,
        tdAttrs: {
            style: {
                'padding-right': '70px',
            }
        }
    },
    initComponent: function () {
        var me = this;
        var method = Ext.create('CGP.costenterconfig.method.method');
        var manufactureCenterStore = method.FilterClazz('manufactureCenterCharactor');
        var workingUnitStore = method.FilterClazz('workingUnitCharacter');
        me.defaults = Ext.Object.merge({
            xtype: 'gridcombo',
            width: 360,
            editable: false,
            allowScroll: true,
            forceSelection: true,
            matchFieldWidth: false,
            getValue: function () {
                var me = this;
                return me.getSubmitValue()[0];
            },
            diySetValue: function (data) {
                var me = this;
                me.setInitialValue(data);
            }
        }, me.defaults);
        me.items = [
            {
                fieldLabel: i18n.getKey('manufactureCenter') + i18n.getKey('matching'),
                itemId: 'manufactureCenterCharactor',
                name: 'manufactureCenterCharactor',
                valueField: '_id',
                displayField: 'description',
                store: manufactureCenterStore,
                haveReset: true,
                gotoConfigHandler: function () {
                    var me = this;
                    var attributeId = me.getSubmitValue();
                    if (attributeId) {
                        JSOpen({
                            id: attributeId[0],
                            url: path + 'partials/processinstancejobcharacter/main.html?_id=' + attributeId[0],
                            title: i18n.getKey('processCharacter'),
                            refresh: true,
                        });
                    }
                },
                gridCfg: {
                    width: 500,
                    height: 300,
                    viewConfig: {
                        enableTextSelection: true
                    },
                    columns: [
                        {
                            xtype: 'rownumberer',
                        },
                        {
                            text: i18n.getKey('id'),
                            width: 120,
                            dataIndex: '_id'
                        },
                        {
                            text: i18n.getKey('code'),
                            width: 120,
                            dataIndex: 'code'
                        },
                        {
                            text: i18n.getKey('description'),
                            flex: 1,
                            dataIndex: 'description',
                            renderer: function (value, metadata) {
                                metadata.tdAttr = "data-qtip='" + value + "'";
                                return value;
                            }
                        },
                    ],
                    bbar: {
                        xtype: 'pagingtoolbar',
                        store: manufactureCenterStore,
                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                        emptyMsg: i18n.getKey('noData')
                    }
                },
                listeners: {
                    afterrender: function (field) {
                        var me = this;
                        var target = field.bodyEl.id;
                        Ext.create('Ext.tip.ToolTip', {
                            target: target,
                            autoHide: true,
                            items: [
                                {
                                    xtype: 'displayfield',
                                    itemId: 'tooltipText',
                                },
                            ],
                            listeners: {
                                // 当元素被显示时动态改变内容.
                                beforeshow: function () {
                                    var value = me.getRawValue();
                                    if (!value) {
                                        value = '请选择生产中心特征';
                                    }
                                    this.getComponent('tooltipText').setValue(value);
                                }
                            }
                        })
                    }
                }
            },
            {
                fieldLabel: i18n.getKey('workingUnit') + i18n.getKey('matching'),
                itemId: 'workingUnitCharacter',
                name: 'workingUnitCharacter',
                valueField: '_id',
                displayField: 'workingunit',
                store: workingUnitStore,
                gridCfg: {
                    width: 500,
                    height: 300,
                    viewConfig: {
                        enableTextSelection: true
                    },
                    columns: [
                        {
                            xtype: 'rownumberer',
                        },
                        {
                            text: i18n.getKey('id'),
                            width: 120,
                            dataIndex: '_id'
                        },
                        {
                            text: i18n.getKey('scope'),
                            flex: 1,
                            dataIndex: 'workingunit'
                        },
                    ],
                    bbar: {
                        xtype: 'pagingtoolbar',
                        store: workingUnitStore,
                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                        emptyMsg: i18n.getKey('noData')
                    }
                },
                allowBlank: false,
            }
        ];
        me.callParent();
    }
})