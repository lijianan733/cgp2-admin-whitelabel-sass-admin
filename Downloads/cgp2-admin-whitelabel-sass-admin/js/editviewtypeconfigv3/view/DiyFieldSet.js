/**
 * Created by nan on 2020/7/29.
 */
Ext.Loader.syncRequire([
    'CGP.editviewtypeconfigv3.view.ComponentFieldSet',
    'CGP.editviewtypeconfigv3.config.Config'
])
Ext.define('CGP.editviewtypeconfigv3.view.DiyFieldSet', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.diyfieldset',
    collapsible: true,
    header: false,
    autoScroll: true,
    margin: '10 50 50 50',
    style: {
        padding: '10 25 10 25',
        borderRadius: '8px'
    },
    defaults: {
        margin: '5 50 5 50',
        width: 400
    },
    layout: {
        type: 'vbox',
    },
    width: '90%',
    data: null,//配置数据
    tipText: null,//提示文本
    collapsed: false,//初始时收缩状态
    areaType: null,
    title: null,
    name: null,
    canAddComponent: true,//是否能添加组件
    checked: true,//是否启用
    constructor: function (config) {
        var me = this;
        if (config) {
            var tip = config.tipText || '';
            config.title = "<font size='2' style= ' color:green;font-weight: bold'>" + i18n.getKey(config.title) + '</font>'
            if (tip) {
                config.title += '<img  title="' + tip + '" style="cursor:pointer;margin:0 5px 4px 5px;vertical-align: middle;width:15px; height:15px" ' +
                    'src="' + path + 'ClientLibs/extjs/resources/themes/images/shared/fam/help.png' + '"/>';

            }
        }
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.items = [];
        var sizeValueField = function () {
            var result = {
                xtype: 'numberfield',
                name: 'sizeValue',
                minValue: 0,
                itemId: 'sizeValue',
                allowBlank: true,//现在预先为空
            };
            if (me.areaType == 'Top' || me.areaType == 'Bottom') {
                result.fieldLabel = i18n.getKey('height');

            } else if (me.areaType == 'Left' || me.areaType == 'Right') {
                result.fieldLabel = i18n.getKey('width');
            } else {
                result.disabled = true;
                result.hidden = true;
            }
            return result;
        }();
        var components = function () {
            var result = [];
            if (me.areaType == 'Top') {
                result.push({
                    xtype: 'componentfieldset',
                    title: 'NavBar',
                    areaType: me.areaType,
                    hasDeleteCmp: false,
                    defaultValue: {
                        isCheck: true,
                        type: 'CommonNavBar',
                        name: 'NavBar'
                    }
                })
            } else if (me.areaType == 'DocumentView') {
                result = [
                    {
                        xtype: 'componentfieldset',
                        title: 'DocumentComponent',
                        areaType: me.areaType,
                        hasDeleteCmp: false,
                        defaultValue: {
                            isCheck: true,
                            showWhenPreview: true,
                            type: 'UploadDocument',
                            name: 'DocumentComponent'
                        }
                    },
                    {
                        xtype: 'componentfieldset',
                        title: 'ToolTips',
                        areaType: me.areaType,
                        hasDeleteCmp: false,
                        defaultValue: {
                            isCheck: false,
                            type: 'ToolTips',
                            name: 'ToolTips'
                        }
                    },
                    {
                        xtype: 'componentfieldset',
                        title: 'AssistBar',
                        areaType: me.areaType,
                        hasDeleteCmp: false,
                        defaultValue: {
                            isCheck: false,
                            type: 'AssistBar',
                            name: 'AssistBar'
                        }
                    },
                    {
                        xtype: 'componentfieldset',
                        title: 'DocumentTop',
                        areaType: me.areaType,
                        hasDeleteCmp: false,
                        defaultValue: {
                            isCheck: false,
                            type: 'CommonNavBar',
                            name: 'DocumentTop'
                        }
                    },
                    {
                        xtype: 'componentfieldset',
                        title: 'DocumentBottom',
                        areaType: me.areaType,
                        hasDeleteCmp: false,
                        defaultValue: {
                            isCheck: false,
                            type: 'CommonNavBar',
                            name: 'DocumentBottom'
                        }
                    },
                    {
                        xtype: 'componentfieldset',
                        title: 'DocumentLeft',
                        areaType: me.areaType,
                        hasDeleteCmp: false,
                        defaultValue: {
                            isCheck: false,
                            type: 'CommonNavBar',
                            name: 'DocumentLeft'
                        }
                    }, {
                        xtype: 'componentfieldset',
                        title: 'DocumentRight',
                        areaType: me.areaType,
                        hasDeleteCmp: false,
                        defaultValue: {
                            isCheck: false,
                            type: 'CommonNavBar',
                            name: 'DocumentRight'
                        }
                    }
                ];
            }
            return result;
        }();
        var optionalItems = function () {
            var result = null;
            if (me.areaType == 'DocumentView') {
                result = [
                    {
                        value: 'border',
                        display: i18n.getKey('边框布局(包含上下左右中五块区域)')
                    },
                    {
                        value: 'customize',
                        display: i18n.getKey('自定义布局')
                    },
                ]
            } else if (me.areaType == 'Top') {
                result = [
                    {
                        value: 'single',
                        display: i18n.getKey('单一组件布局')
                    },
                    {
                        value: 'customize',
                        display: i18n.getKey('自定义布局')
                    },
                ]
            } else {
                result = [
                    {
                        value: 'tab',
                        display: i18n.getKey('选项卡布局(默认)')
                    },
                    {
                        value: 'accordion',
                        display: i18n.getKey('折叠布局')
                    },
                    {
                        value: 'single',
                        display: i18n.getKey('单一组件布局')
                    },
                    {
                        value: 'customize',
                        display: i18n.getKey('自定义布局')
                    }
                ]
            }
            return result;
        }();
        var defaultLayoutTemplate = function () {
            var result = null;
            if (me.areaType == 'DocumentView') {
                result = CGP.editviewtypeconfigv3.config.Config.layoutTemplates.border;
            } else if (me.areaType == 'Top') {
                result = CGP.editviewtypeconfigv3.config.Config.layoutTemplates.single;
            } else {
                result = CGP.editviewtypeconfigv3.config.Config.layoutTemplates.tab;
            }
            var arr = [];
            for (var i = 0; i < result.length; i++) {
                arr.push({
                    template: result[i]
                })
            }
            return arr;
        }();

        me.items = [
            {
                xtype: 'checkbox',
                name: 'showWhenPreview',
                itemId: 'showWhenPreview',
                margin: '0 50 0 50',
                inputValue: true,
                fieldLabel: i18n.getKey('预览时显示'),
                checked: true,
            },
            sizeValueField,
            {
                name: 'id',
                itemId: 'id',
                hidden: true,
                xtype: 'textfield',
            },
            {
                xtype: 'combo',
                name: 'container',
                itemId: 'container',
                valueField: 'value',
                displayField: 'display',
                margin: '0 50 0 50',
                editable: false,
                value: function () {
                    if (me.areaType == 'Top') {
                        //TOP默认为single
                        return 'single'
                    } else if (me.areaType == 'DocumentView') {
                        //documentView区域默认为border,其他位置为tab
                        return 'border';
                    } else {
                        return 'tab';
                    }
                }(),
                fieldLabel: i18n.getKey('layout'),
                store: Ext.create('Ext.data.Store', {
                    fields: ['value', 'display'],
                    data: optionalItems
                }),
                listeners: {
                    change: function (combo, newValue, oldValue) {
                        var layoutTemplates = combo.ownerCt.getComponent('layoutTemplates');
                        var data = CGP.editviewtypeconfigv3.config.Config.layoutTemplates[newValue] || [];
                        var result = [];
                        for (var i = 0; i < data.length; i++) {
                            result.push({
                                template: data[i]
                            })
                        }
                        layoutTemplates.setSubmitValue(result);

                    }
                }
            },
            {
                name: 'layoutTemplates',
                xtype: 'gridfieldwithcrudv2',
                width: 500,
                fieldLabel: i18n.getKey('layoutTemplates'),
                itemId: 'layoutTemplates',
                /*  hidden: true,
                  disabled: true,*/
                gridConfig: {
                    disabled: me.disabled,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['template'],
                        data: defaultLayoutTemplate
                    }),
                    minHeight: 100,
          /*          resizable: true,
                    resizeHandles: 'se',*/
                    width: 500,
                    columns: [
                        {
                            text: i18n.getKey('template'),
                            flex: 1,
                            dataIndex: 'template',
                            itemId: 'template',
                            renderer: function (value, mateData, record) {
                                var data = JSUbbToHtml(value);
                                mateData.tdAttr = 'data-qtip="' + data + '"';
                                return data;
                            }
                        },
                    ],
                },
                winConfig: {
                    width: 450,
                    height: 350,
                    maximizable: true,
                    formConfig: {
                        layout: {
                            type: 'fit'
                        },
                        autoScroll: false,
                        defaults: {
                            margin: '-5 5 5 5'
                        },
                        items: [
                            {
                                xtype: 'textarea',
                                name: 'template'
                            }
                        ]
                    }
                },
                diyGetValue: function () {
                    var me = this;
                    var data = me.getSubmitValue();
                    if (data.length > 0) {
                        var result = [];
                        for (var i = 0; i < data.length; i++) {
                            result.push(data[i].template);
                        }
                        return result;
                    } else {
                        return null;
                    }
                },
                diySetValue: function (data) {
                    var me = this;
                    if (data) {
                        var result = [];
                        for (var i = 0; i < data.length; i++) {
                            result.push({
                                template: data[i]
                            });
                        }
                        me.setSubmitValue(result);
                    }
                }
            },
            {
                name: 'layoutPosition',
                hidden: true,
                itemId: 'layoutPosition',
                xtype: 'textfield',
                value: me.areaType
            },
            {
                name: 'checked',
                hidden: true,
                itemId: 'checked',
                xtype: 'textfield',
                value: true
            },
            {
                xtype: 'toolbar',
                color: 'black',
                width: '100%',
                bodyStyle: 'border-color:white;',
                border: '0 0 1 0',
                margin: '5 0 5 0',
                itemId: 'templateConfigToolBar',
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: false,
                        value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('组件列表') + '</font>'
                    },
                    {
                        xtype: 'button',
                        itemId: 'button',
                        iconCls: 'icon_add',
                        count: 0,
                        hidden: !me.canAddComponent,
                        componentCls: 'btnOnlyIcon',
                        handler: function (btn) {
                            var form = btn.ownerCt.ownerCt;
                            var components = form.getComponent('components');
                            components.add({
                                xtype: 'componentfieldset',
                                areaType: form.areaType,
                                title: '组件' + (components.items.items.length + 1)
                            })
                        }
                    }
                ]
            },
            {
                xtype: 'uxfieldcontainer',
                itemId: 'components',
                msgTarget: 'none',
                margin: '5 0 5 0',
                layout: {
                    type: 'table',
                    columns: 2
                },
                defaults: {
                    margin: '10 0 10 50',
                    allowBlank: false,
                    width: 400
                },
                name: 'components',
                items: components,
                isValid: function () {
                    var me = this;
                    me.Errors = {};
                    var valid = true;
                    if (me.disabled == false) {
                        for (var i = 0; i < me.items.items.length; i++) {
                            var item = me.items.items[i];
                            if (item.disabled) {
                            } else {
                                if (item.isValid()) {
                                } else {
                                    valid = false;
                                }
                            }
                        }
                    }
                    return valid;
                },
                getValue: function () {
                    var me = this;
                    var result = [];
                    for (var i = 0; i < me.items.items.length; i++) {
                        var componentData = me.items.items[i].getValue();
                        if (componentData.allowUse) {
                            result.push(componentData);
                        }
                    }
                    return result;
                },
                setValue: function (data) {
                    var me = this;
                    var areaType = me.ownerCt.areaType;
                    console.log(data);
                    if (areaType == 'Top') {
                        me.items.items[0].setValue(data[0]);
                    } else if (areaType == 'DocumentView') {
                        for (var j = 0; j < me.items.items.length; j++) {
                            var isHaveValue = false;
                            var item = me.items.items[j];
                            for (var i = 0; i < data.length; i++) {
                                if (me.items.items[j].defaultValue.name == data[i].name) {
                                    me.items.items[j].setValue(data[i]);
                                    isHaveValue = true;
                                    continue;
                                }
                            }
                            if (isHaveValue == false) {
                                var allowUse = item.getComponent('allowUse');
                                allowUse.setValue(false);
                            }
                        }

                    } else {
                        me.removeAll();
                        for (var i = 0; i < data.length; i++) {
                            me.add({
                                xtype: 'componentfieldset',
                                areaType: areaType,
                                title: data[i].name,
                                defaultValue: {
                                    isCheck: true,
                                    type: data[i].type,
                                    name: data[i].name,
                                    id: data[i].id,
                                    showWhenPreview: data[i].showWhenPreview,
                                }
                            })
                        }
                    }
                }
            }
        ];
        me.callParent();
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        me.items.items.forEach(function (item) {
            if (item.rendered) {
                if (item.isValid && item.isValid() == false) {
                    isValid = false;
                }
            }
        });
        isValid ? null : me.expand();
        return isValid;
    },
    getErrors: function () {
        return '该配置必须完备';
    },
    getFieldLabel: function () {
        return this.areaType;
    },
    getValue: function () {
        var me = this;
        var result = {};
        me.items.items.forEach(function (item) {
            if (item.diyGetValue && item.disabled != true) {
                result[item.getName()] = item.diyGetValue();
            } else if (item.getValue && item.disabled != true) {
                result[item.getName()] = item.getValue();
            }
        });
        return result;
    },
    setValue: function (data) {
        var me = this;
        me.suspendLayouts();
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.diySetValue) {
                item.diySetValue(data[item.getName()]);
            } else if (item.setValue) {
                item.setValue(data[item.getName()]);
            }
        }
        me.resumeLayouts();
        me.doLayout();
    },
    getName: function () {
        var me = this;
        return me.name;
    }
})
