/**
 * Created by nan on 2020/7/29.
 */
Ext.Loader.syncRequire([
    'CGP.editviewtypeconfig.view.ComponentFieldSet'
])
Ext.define('CGP.editviewtypeconfig.view.DiyFieldSet', {
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
        width: '100%'
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
        var sizeValueField = {
            xtype: 'numberfield',
            name: 'sizeValue',
            margin: '0 50 0 50',
            minValue: 0,
            itemId: 'sizeValue',
            allowBlank: true,//现在预先为空
            labelWidth: 50,
            width: 400
        };
        /*  com.qpp.cgp.domain.product.config.view.builder.runtime.BackgroundLibraryComponent
          com.qpp.cgp.domain.product.config.view.builder.runtime.ColorLibraryComponent
          com.qpp.cgp.domain.product.config.view.builder.runtime.DiceNavBarComponent

          com.qpp.cgp.domain.product.config.view.builder.runtime.FontLibraryComponent

          com.qpp.cgp.domain.product.config.view.builder.runtime.ImageLibraryComponent
          com.qpp.cgp.domain.product.config.view.builder.runtime.SingleViewBoardComponent*/


        if (me.areaType == 'H1' || me.areaType == 'Bottom') {
            sizeValueField.fieldLabel = i18n.getKey('height');

        } else if (me.areaType == 'Left' || me.areaType == 'Right') {
            sizeValueField.fieldLabel = i18n.getKey('width');
        } else {
            sizeValueField.disabled = true;
            sizeValueField.hidden = true;
        }
        var components = [];
        if (me.areaType == 'H1') {
            components.push({
                xtype: 'componentfieldset',
                title: 'H1',
                areaType: me.areaType,
                hasDeleteCmp: false,
                defaultValue: {
                    isCheck: true,
                    type: 'H1NavBar',
                    name: 'H1'
                }
            })
        } else if (me.areaType == 'Document') {
            components = [
                {
                    xtype: 'componentfieldset',
                    title: 'DocumentView',
                    areaType: me.areaType,
                    hasDeleteCmp: false,
                    defaultValue: {
                        isCheck: true,
                        type: 'SingleViewBoard',
                        name: 'DocumentView'
                    }
                },
                /* {
                     xtype: 'componentfieldset',
                     title: 'H2',
                     areaType: me.areaType,
                     hasDeleteCmp: false,
                     defaultValue: {
                         isCheck: true,
                         type: 'H2',
                         name: 'H2'
                     }
                 }, */{
                    xtype: 'componentfieldset',
                    title: 'H3',
                    areaType: me.areaType,
                    hasDeleteCmp: false,
                    defaultValue: {
                        isCheck: true,
                        type: 'DiceNavBar',
                        name: 'H3'
                    }
                }, {
                    xtype: 'componentfieldset',
                    title: 'ToolBar',
                    areaType: me.areaType,
                    hasDeleteCmp: false,
                    defaultValue: {
                        isCheck: true,
                        type: 'ToolBar',
                        name: 'ToolBar'
                    }
                },
                {
                    xtype: 'componentfieldset',
                    title: 'ToolTips',
                    areaType: me.areaType,
                    hasDeleteCmp: false,
                    defaultValue: {
                        isCheck: true,
                        type: 'ToolTips',
                        name: 'ToolTips'
                    }
                },
                {
                    xtype: 'componentfieldset',
                    title: 'H4',
                    areaType: me.areaType,
                    hasDeleteCmp: false,
                    defaultValue: {
                        isCheck: true,
                        type: 'CalendarNavBar',
                        name: 'H4'
                    }
                },
                {
                    xtype: 'componentfieldset',
                    title: 'AssistBar',
                    areaType: me.areaType,
                    hasDeleteCmp: false,
                    defaultValue: {
                        isCheck: true,
                        type: 'AssistBar',
                        name: 'AssistBar'
                    }
                }
            ]
        }
        /*
                sizeValueField.allowBlank = (components.length == 0 ? true : false);//根据是否
        */
        me.items = [
            sizeValueField,
            {
                name: 'id',
                itemId: 'id',
                hidden: true,
                xtype: 'textfield',
                /*
                                value: Ext.isEmpty(JSGetQueryString('id')) ? JSGetCommonKey(false) : null
                */
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
                layout: {
                    type: 'table',
                    columns: 2

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
                    if (areaType == 'H1') {
                        var allowUse = me.items.items[0].getComponent('allowUse');
                        var id = me.items.items[0].getComponent('id');
                        var type = me.items.items[0].getComponent('type');
                        type.setValue(data[0].type);
                        allowUse.setValue(true);
                        id.setValue(data[0].id);
                    } else if (areaType == 'Document') {
                        for (var j = 0; j < me.items.items.length; j++) {
                            var isHaveValue = false;
                            var item = me.items.items[j];
                            for (var i = 0; i < data.length; i++) {
                                if (me.items.items[j].defaultValue.name == data[i].name) {
                                    var type = item.getComponent('type');
                                    var allowUse = item.getComponent('allowUse');
                                    var id = item.getComponent('id');
                                    type.setValue(data[i].type);
                                    allowUse.setValue(true);
                                    id.setValue(data[i].id);
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
                                    id: data[i].id
                                }
                            })
                        }
                    }
                },
                listeners: {
                    //不需要约束宽高了
                    /*   afterrender: function (components) {
                           components.on('remove', function () {
                               var me = this;
                               var sizeValue = me.ownerCt.getComponent('sizeValue');
                               if (me.items.items.length == 0) {
                                   sizeValue.setAllowBlank(true);
                               }
                           })
                           components.on('add', function () {
                               var me = this;
                               var sizeValue = me.ownerCt.getComponent('sizeValue');
                               if (me.items.items.length != 0) {
                                   sizeValue.setAllowBlank(false);
                               }
                           })
                       },*/
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
            if (item.getValue && item.disabled != true) {
                result[item.getName()] = item.getValue();
            }
        });
        return result;
    },
    setValue: function (data) {
        var me = this;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.setValue) {
                item.setValue(data[item.getName()]);
            }
        }
    },
    getName: function () {
        var me = this;
        return me.name;
    }
})
