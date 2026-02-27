/**
 * Created by nan on 2020/7/29.
 */
Ext.Loader.syncRequire([
    'CGP.editviewtypeconfigv3.view.DiyFieldSet'
])
Ext.define('CGP.editviewtypeconfigv3.view.CenterFormPanel', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    flex: 1,
    height: '100%',
    frame: false,
    autoScroll: true,
    border: false,
    scrollData: {
        top: 0,
        left: 0
    },
    isValidForItems: true,
    isValid: function () {
        this.msgPanel.hide();
        var isValid = true,
            errors = {};
        var leftGridPanel = this.ownerCt.getComponent('leftGridPanel');
        var store = leftGridPanel.getStore();
        var checked = {};
        for (var i = 0; i < store.getCount(); i++) {
            var record = store.getAt(i);
            checked[record.get('layoutPosition')] = record.get('checked');
        }
        console.log(checked);
        this.items.items.forEach(function (f) {
            if (checked[f.areaType]) {
                if (!f.isValid()) {
                    var errorInfo = f.getErrors();
                    if (Ext.isObject(errorInfo) && !Ext.Object.isEmpty(errorInfo)) {//处理uxfieldContainer的错误信息
                        errors = Ext.Object.merge(errors, errorInfo);
                    } else {
                        errors[f.getFieldLabel()] = errorInfo;
                    }
                    isValid = false;

                }
            }
        });
        isValid ? null : this.showErrors(errors);
        return isValid;
    },
    getValue: function () {
        var areas = [];
        var me = this;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            var data = item.getValue();
            if (/*Ext.isEmpty(data.components) && Ext.isEmpty(data.sizeValue)*/item.disabled == false) {
                areas.push(data);
            } else {
            }
        }
        console.log(areas);
        return areas;
    },
    setValue: function (data) {
        var me = this;
        var areas = data.areas;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            for (var j = 0; j < areas.length; j++) {
                if (item.areaType == areas[j].layoutPosition) {
                    item.setValue(areas[j]);
                    item.setDisabled(false);
                    continue;
                }
            }
        }
    },
    listeners: {
        afterrender: function (fieldSet) {
            var me = this;
            //代理监听内部body的滚动条事件
            me.relayEvents(me.body.el, ['scroll']);
        },
        //记录滚动条位置
        scroll: function () {
            var me = this;
            me.scrollData = me.body.getScroll();
        },
        afterLayout: function () {
            var me = this;
            me.body.setScrollTop(me.scrollData.top);
        }
    },
    initComponent: function () {
        var me = this;
        var AREAS = [
            'Top',
            'Left',
            'Right',
            'Bottom',
            'DocumentView'
        ];
        me.items = [];
        for (var i = 0; i < AREAS.length; i++) {
            var canAddComponent = true;
            me.suspendLayouts();
            var disabled = true;
            if (AREAS[i] == 'Top' || AREAS[i] == 'DocumentView') {
                canAddComponent = false;
                disabled = false;
            }
            me.items.push({
                xtype: 'diyfieldset',
                name: AREAS[i],
                collapsed: true,
                title: AREAS[i],
                disabled: disabled,
                areaType: AREAS[i],
                canAddComponent: canAddComponent,
            });
            me.resumeLayouts();
            me.doLayout();

        }
        me.callParent();
    }
})
