/**
 * Created by nan on 2020/7/30.
 */
Ext.define('CGP.editviewtypeconfigv3.view.ComponentFieldSet', {
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
        flex: 1,
        colspan: 2,
        labelWidth: 100,
    },
    layout: {
        type: 'table',
        columns: 2,
    },
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
            DocumentComponent: [
                'CanvasDocument',
                'UploadDocument',
                'ThreeDDocument'
            ],
            ToolTips: [
                'ToolTips',
            ],
            AssistBar: [
                'AssistBar'
            ],
        },
        //指定大区域内的组件类型
        outLocation: {
            /*     Left: [
                     'ImageLibrary',
                     'ColorPropertyEditor',
                     'FontLibrary',
                     'ColorLibrary',
                     'BackgroundLibrary',
                     'ActionLibrary'
                 ],
                 Right: [
                     'ImageLibrary',
                     'ColorPropertyEditor',
                     'FontLibrary',
                     'ColorLibrary',
                     'BackgroundLibrary',
                     'ActionLibrary'
                 ],
                 Bottom: [
                     'ImageLibrary',
                     'ColorPropertyEditor',
                     'FontLibrary',
                     'ColorLibrary',
                     'BackgroundLibrary',
                     'ActionLibrary'
                 ],*/
        },
        //没有限制的组件列表

    },
    allType: [
        'ImageLibrary',
        'ResourceLibrary',
        'ToolTips',
        'AssistBar',
        'RuntimeModelEditor',
        'CommonNavBar',
        'CanvasDocument',
        'UploadDocument',
        'ThreeDDocument',
        'PhotoEditor',
        'TextEditor',
        'TemplateDownload',
        'ColorPropertyEditor',
        'FontLibrary',
        'ColorLibrary',
        'BackgroundLibrary',
        'QuickPreview'

    ],
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
        var inLocation = '';
        if (me.defaultValue) {
            inLocation = me.defaultValue.name;
        }
        if (me.mapping.outLocation[me.areaType]) {//加在大区域约束里面的组件
            for (var i = 0; i < me.mapping.outLocation[me.areaType].length; i++) {
                var item = me.mapping.outLocation[me.areaType][i];
                result.push({
                    value: item,
                    display: item
                })
            }
        } else if (me.mapping.inLocation[inLocation]) {//加在指定小区域
            var optionalType = me.mapping.inLocation[inLocation];
            if (optionalType) {
                for (var i = 0; i < optionalType.length; i++) {
                    var item = optionalType[i];
                    result.push({
                        value: item,
                        display: item
                    })
                }
            }
        } else {
            for (var i = 0; i < me.allType.length; i++) {
                var item = me.allType[i];
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
                colspan: 1,
                width: 150,
                hidden: me.areaType != 'DocumentView' || (me.defaultValue ? (me.defaultValue.type == 'DocumentComponent') : false),
                readOnly: me.defaultValue ? (me.defaultValue.type == 'DocumentComponent') : false,
                checked: me.defaultValue ? me.defaultValue.isCheck : true
            },
            {
                xtype: 'checkbox',
                itemId: 'showWhenPreview',
                width: 150,
                colspan: 2,
                fieldLabel: i18n.getKey('showWhenPreview'),
                name: 'showWhenPreview',
                checked: me.defaultValue ? me.defaultValue.showWhenPreview : true
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
                colspan: 3,
                width: 350,
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
                colspan: 3,
                width: 350,
                readOnly: me.areaType == 'DocumentView' || me.areaType == 'Top',
                hidden: me.areaType == 'DocumentView' || me.areaType == 'Top',
                fieldStyle: (me.areaType == 'DocumentView' || me.areaType == 'Top') ? 'background-color:silver' : null,
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
                if (item.diyGetValue) {
                    result[item.getName()] = item.diyGetValue();
                } else if (item.getValue) {
                    result[item.getName()] = item.getValue();
                }
            }
        });
        return result;
    },
    setValue: function (data) {
        var me = this;
        var allowUse = me.getComponent('allowUse');
        var id = me.getComponent('id');
        var type = me.getComponent('type');
        var showWhenPreview = me.getComponent('showWhenPreview');
        type.setValue(data['type']);
        allowUse.setValue(true);
        id.setValue(data['id']);
        showWhenPreview.setValue(data['showWhenPreview']);

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
