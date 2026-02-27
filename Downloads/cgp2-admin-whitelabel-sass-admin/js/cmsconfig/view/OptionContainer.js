/**
 * @Description:
 * @author nan
 * @date 2022/5/6
 */
Ext.define('CGP.cmsconfig.view.OptionContainer', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.optioncontainer',
    optionalData: null,//指定combo中的数据
    labelAlign: 'left',
    defaults: {},
    minHeight: 50,
    grow: true,
    maxHeight: 100,
    _panel: null,
    selType: 'rowmodel',
    _contentId: null,
    layout: 'fit',
    tipInfo: null,
    msgTarget: 'side',
    allowBlank: true,
    panelConfig: null,
    allowChangSort: false,//是否允许拖拽移动组件
    allowDelete: true,//是否允许删除添加的数据
    resultType: 'String',//该组件获取结果和设置值的数据类型
    allowDiyInput: true,//是否允许自定字符串
    diyInputComponent: null,//自定义值获取组件
    deleteHandlerName: 'deleteOption',
    constructor: function (config) {
        var me = this;
        me.callParent(arguments);
        if (me.optionalData) {

        } else {
            me.optionalData = [];
        }
        window[me.deleteHandlerName] = window[me.deleteHandlerName] || function (itemId) {
            var field = Ext.getCmp(itemId);
            field.ownerCt.remove(field);
        };
    },
    initComponent: function () {
        var me = this;
        if (me.allowChangSort) {
            me.tipInfo = me.tipInfo;
        }
        if (me.allowChangSort == true) {
            me.tipInfo = '允许拖拽数据项改变顺序'
        }
        me.callParent(arguments);

        if (me.value) {
            me.on('afterrender', function () {
                me.diySetValue(me.value);
            });
        }
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        if (me.allowBlank == false && me.disabled == false) {
            isValid = !Ext.isEmpty(me.getSubmitValue());
        } else {
            isValid = true;
        }
        if (isValid) {
            me.clearError();
            me.unsetActiveError();
        } else {
            me.setActiveError('不允许为空');
            me.renderActiveError();
        }
        me.doLayout();
        return isValid;
    },
    getErrors: function () {
        return '不允许为空'
    },
    clearError: function () {
        var me = this;
        if (me.errorEl) {
            //隐藏错误提示信息的dom
            me.errorEl.dom.setAttribute('style', 'display: none');
        }
    },
    onRender: function () {
        this.callParent(arguments);
        this.initPanel();
    },
    onDragEnter: function (e, id) {
        Ext.get(id).dom.style.border = "dashed #94c700 2px";
    },
    onDragOut: function (e, id) {
        Ext.get(id).dom.style.border = "solid #000 0px";
    },
    /**
     * 放下后的处理
     * @param target
     * @param e
     * @param id
     */
    afterDragDrop: function (target, e, id) {
        var me = this;
        var targetEl = Ext.getCmp(target.id);
        var sourceEl = Ext.getCmp(me.id);
        var container = targetEl.ownerCt;
        var targetElIndex = container.items.indexOf(targetEl);
        var sourceElElIndex = container.items.indexOf(sourceEl);
        container.items.remove(targetEl);
        container.items.insert(targetElIndex, sourceEl);
        container.items.insert(sourceElElIndex, targetEl);
        for (var i = 0; i < container.items.items.length; i++) {
            container.items.items[i].el.dom.style.border = "solid #000 0px";
        }
        container._isLayoutRoot = true;
        container.updateLayout();
        container._isLayoutRoot = false;
    },
    initPanel: function () {
        var me = this;
        me.panelConfig = Ext.merge({
            layout: 'anchor',
            autoScroll: true,
            renderTo: document.getElementById(me._contentId),
            bodyStyle: {
                borderColor: 'silver #d9d9d9 #d9d9d9'
            },
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'right',
                    width: 80,
                    layout: {
                        type: 'vbox',
                        align: 'center'
                    },
                }
            ],
            itemId: 'arrayInnerPanel',
            items: [],
            minHeight: me.minHeight,
            maxHeight: me.maxHeight,
        }, me.panelConfig);
        me._panel = new Ext.panel.Panel(me.panelConfig);
        me._panel.on('add', function () {
            me.isValid();
        });
        me._panel.on('remove', function () {
            me.isValid();
        });
        me.add(me._panel);
    },
    reset: function () {
        this._panel.removeAll();
    },
    getPanel: function () {
        return this._panel;
    },
    setReadOnly: function (readOnly) {
        var me = this;
        var toolbar = me._panel.getDockedItems('toolbar[dock="right"]')[0];
        toolbar.items.items[0].setDisabled(readOnly);

    },
    setDisabled: function () {
        var me = this;
        me.callParent(arguments);
        if (me._panel) {
            me._panel.setDisabled(false);
        }
    },
    getSubmitValue: function () {
        var me = this;
        var value = [];
        var fieldArray = me._panel.items.items;
        for (var i = 0; i < fieldArray.length; i++) {
            var field = fieldArray[i];
            value.push(field.realValue);
        }
        if (me.resultType == 'Array') {
        } else {
            value = value.toString();
        }
        return value;
    },
    setSubmitValue: function (value) {
        var me = this;
        me.reset();
        if (Ext.isEmpty(value)) {
            me.reset();
        } else {
            var itemArray = [];
            if (Ext.isArray(value)) {
                itemArray = value;
            } else if (Ext.isString(value)) {
                itemArray = value.split(",");
            } else {
                throw Error('value非数组，或无法转换为数组');
            }
            for (var i = 0; i < itemArray.length; i++) {
                me.setSingleValue(itemArray[i]);
            }
        }
    },
    setSingleValue: function (value) {
        var me = this;
        var panel = me._panel;
        var imgUrl = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png';
        var id = JSGetUUID();
        var displayName = me.getDisplayValue ? me.getDisplayValue(value) : value;
        for (var i = 0; i < me.optionalData.length; i++) {
            var item = me.optionalData[i];
            if (value == item['value']) {
                displayName = item['display'];
                break;
            }
        }
        var objDisplay = {
            id: id,
            style: 'display:inline-block;',
            hideLabel: true,
            realValue: value,
            value: "<div style='display: inline-block;' id = '" + id + "' class='itemDiv'>" + displayName +
                "<img title='删除' style='cursor: pointer;    visibility:" + (me.allowDelete ? 'visible' : 'hidden') + ";" +
                "vertical-align: middle;width:15px; height:15px' src='" + imgUrl + "' onclick='" + me.deleteHandlerName + "(\"" + id + "\")'/>" + '&nbsp&nbsp&nbsp' + "</div></p>"
        };
        var displayField = Ext.Object.merge(objDisplay, {
            xtype: 'displayfield',
            listeners: {
                afterrender: function () {
                    var displayField = this;
                    var arrayDataField = displayField.ownerCt.ownerCt;
                    if (arrayDataField.allowChangSort == true) {
                        var dragSource = new Ext.dd.DragSource(displayField.id, {group: 'dd'});
                        dragSource.afterDragDrop = arrayDataField.afterDragDrop;
                        dragSource.onDragEnter = arrayDataField.onDragEnter;
                        dragSource.onDragOut = arrayDataField.onDragOut;
                        //只有相同group的DDProxy/DragSource才会接受)
                        new Ext.dd.DDTarget(displayField.id, 'dd');
                    }
                }
            }
        });
        panel.add(displayField);

    },
    setValue: function (data) {
        var me = this;
        me.setSubmitValue(data);
    },
    getValue: function () {
        var me = this;
        return me.getSubmitValue();
    },
    diySetValue: function (data) {
        var me = this;
        me.setSubmitValue(data);
    },
    diyGetValue: function () {
        var me = this;
        return me.getSubmitValue();
    }
})
