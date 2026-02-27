/**
 * Created by nan on 2020/7/30.
 */
Ext.define('CGP.editviewtypeconfig.view.ComponentFieldSet', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.componentfieldset',
    collapsible: false,
    header: false,
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
    width: 500,
    hadAddCmp: true,
    data: null,//配置数据
    tipText: null,//提示文本
    collapsed: false,//初始时收缩状态
    defaultValue: null,//默认值，这是H1和document区域才有的配置，有这个配置时，其组件不能编辑，且名称默认为组件类型
    hasDeleteCmp: true,
    //区域可选组件规则，目前规则就两个，指定具体小区域的组件类型，和指定大的区块内组件类型
    mapping: {
        //指定小区域内的组件类型
        inLocation: {
            DocumentView: [
                'SingleViewUploadEditBoard',
                'MultiViewUploadEditBoard',
                'ThreeDPreviewBoard',
                'SingleViewEditBoard',
                'SingleViewPreviewBoard',
                'SingleViewBoard'
            ],
            ToolBar: [
                'ToolBar'
            ],
            ToolTips: [
                'ToolTips',
            ],
            AssistBar: [
                'AssistBar'
            ],
            H1: [
                'H1NavBar',
                'DiceNavBar',
                'CalendarNavBar',
                'ImageButtonNavBar',
                'PagingNavBar',
            ],
            H2: [
                'H1NavBar',
                'DiceNavBar',
                'CalendarNavBar',
                'ImageButtonNavBar',
                'PagingNavBar',
            ],
            H3: [
                'H1NavBar',
                'DiceNavBar',
                'CalendarNavBar',
                'ImageButtonNavBar',
                'PagingNavBar',
            ],
            H4: [
                'H1NavBar',
                'DiceNavBar',
                'CalendarNavBar',
                'ImageButtonNavBar',
                'PagingNavBar',
            ],
        },
        //指定大区域内的组件类型
        outLocation: {
            Left: [
                'ImageLibrary',
                'ColorPropertyLibrary',
                'FontLibrary',
                'ColorLibrary',
                'BackgroundLibrary',
            ],
            Right: [
                'ImageLibrary',
                'ColorPropertyLibrary',
                'FontLibrary',
                'ColorLibrary',
                'BackgroundLibrary',
            ],
            Bottom: [
                'ImageLibrary',
                'ColorPropertyLibrary',
                'FontLibrary',
                'ColorLibrary',
                'BackgroundLibrary',
            ],
        }
    },
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
    areaType: null,//该组件所属的区域类型
    listeners: {
        afterrender: function (fieldSet) {
            if (fieldSet.hasDeleteCmp) {
                fieldSet.legend.add(fieldSet.createDeleteCmp());
            }
        }
    },
    /**
     *获取到该区块中可以添加的组件列表
     * @returns {[]}
     */
    getOptionalComponent: function () {
        var me = this;
        var result = [];
        console.log(me.areaType);
        console.log(me.defaultValue);
        if (me.mapping.outLocation[me.areaType]) {//加在大区域约束里面的组件
            for (var i = 0; i < me.mapping.outLocation[me.areaType].length; i++) {
                var item = me.mapping.outLocation[me.areaType][i];
                result.push({
                    value: item,
                    display: item
                })
            }
        } else {//加在指定子区域里面的组件
            var inLocation = me.defaultValue.name;
            for (var i = 0; i < me.mapping.inLocation[inLocation].length; i++) {
                var item = me.mapping.inLocation[inLocation][i];
                result.push({
                    value: item,
                    display: item
                })
            }
        }
        return result;
    },
    initComponent: function () {
        var me = this;
        var allowUseType = me.getOptionalComponent();
        console.log(allowUseType);
        me.items = [
            {
                xtype: 'checkbox',
                itemId: 'allowUse',
                fieldLabel: i18n.getKey('isActive'),
                name: 'allowUse',
                hidden: me.areaType != 'Document' || (me.defaultValue ? (me.defaultValue.type == 'DocumentView') : false),
                readOnly: me.defaultValue ? (me.defaultValue.type == 'DocumentView') : false,
                checked: me.defaultValue ? !(Ext.Array.contains(
                        [//这4中默认不选中，即只有documentView是默认选中
                            'ToolTips',
                            'ToolBar',
                            'DiceNavBar',
                            'CalendarNavBar',
                            'AssistBar'
                        ],
                        me.defaultValue.type)
                ) : true
            },
            {
                xtype: 'combo',
                itemId: 'type',
                fieldLabel: i18n.getKey('type'),
                name: 'type',
                editable: false,
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        'value', 'display'
                    ],
                    data: allowUseType
                }),
                value: me.defaultValue ? me.defaultValue['type'] : null,
                valueField: 'value',
                displayField: 'display',
                allowBlank: false
            },
            {
                xtype: 'textfield',
                itemId: 'id',
                hidden: true,
                fieldLabel: i18n.getKey('id'),
                name: 'id',
                value: me.defaultValue ? me.defaultValue['id'] : null,
            },
            {
                xtype: 'textfield',
                itemId: 'name',
                name: 'name',
                readOnly: me.areaType == 'Document' || me.areaType == 'H1',
                hidden: me.areaType == 'Document' || me.areaType == 'H1',
                fieldStyle: (me.areaType == 'Document' || me.areaType == 'H1') ? 'background-color:silver' : null,
                value: me.defaultValue ? me.defaultValue['name'] : null,
                fieldLabel: i18n.getKey('name'),
                allowBlank: false,
                listeners: {
                    //修改名称后改变组件名
                    change: function (textfield, newValue, oldValue) {
                        var fieldSet = textfield.ownerCt;
                        fieldSet.setTitle("<font size='2' style= ' color:green;font-weight: bold'>" + i18n.getKey(newValue) + '</font>');
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
                if (item.isValid() == false) {
                    isValid = false;
                }
            }
        });
        return isValid;
    },
    getValue: function () {
        var me = this;
        var result = {};
        me.items.items.forEach(function (item) {
            if (item.disabled == false) {
                result[item.getName()] = item.getValue();
            }
        });
        return result;
    },
    createDeleteCmp: function () {
        var me = this;
        me.deleteCmp = Ext.widget({
            xtype: 'button',
            margin: '-2 5 0 5',
            tooltip: '删除配置',
            componentCls: 'btnOnlyIcon',
            icon: path + 'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png',
            handler: function (btn) {
                Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                    if (selector == 'yes') {
                        //触发修改事件
                        var container = me.ownerCt;
                        container.remove(me);
                    }
                })
            }
        });
        return me.deleteCmp;
    },
})
