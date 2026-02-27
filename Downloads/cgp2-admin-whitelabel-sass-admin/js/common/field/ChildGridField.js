/**
 * ChildGrid
 * @Author: miao
 * @Date: 2022/3/31
 */
Ext.define("CGP.common.field.ChildGridField", {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    mixins: ['Ext.form.field.Base'],
    alias: 'widget.childgrid',
    layout: {type: 'hbox'},
    labelAlign: 'left',
    defaults: {
        //去除原有的样式
    },
    msgTarget: 'side',
    deleteSrc: path + 'ClientLibs/extjs/resources//themes/images/shared/fam/remove.png',
    btnHandler: null,
    value: null,
    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'button',
                name: 'ratioOffset',
                text: i18n.getKey('compile'),
                handler: me.btnHandler
            },
            {
                xtype: 'displayfield',
                width: 16,
                margin: '-2 0 0 5 ',
                height: 16,
                itemId: 'deleteBtn',
                value: '<img class="tag" title="点击进行清除数据" style="height: 100%;width: 100%;cursor: pointer" src="' + me.deleteSrc + '">',
                listeners: {
                    render: function (display) {
                        var img = display.getEl().down('img');
                        img.addListener("click", function () {
                            Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('是否清除已填写的数据'), function (selector) {
                                if (selector == 'yes') {
                                    var cGridField = display.ownerCt;
                                    cGridField.value = null;
                                }
                            })
                        });
                    }
                }
            },
        ];
        me.callParent(arguments);
        // me.on({
        //     change: Ext.Function.createBuffered(function (comp, newValue, oldValue) {
        //         comp.clearError();
        //     }, 500)
        // })
    },
    initEvents : function(){
        var me = this,
            onChangeTask;

        // listen for immediate value changes
        onChangeTask = new Ext.util.DelayedTask(me.checkChange, me);
        me.onChangeEvent = function() {
            onChangeTask.delay(me.checkChangeBuffer);
        };
        me.callParent();
    },
    isValid: function () {
        var me = this, isValid = true;
        if (!me.allowBlank) {
            if (Ext.isEmpty(me.value)) {
                me.markInvalid('该输入项为必输项');
                me.renderActiveError();
                isValid = false;
            }
        }
        return isValid;
    },
    getValue: function () {
        var me = this;
        return me.value || [];
    },
    setValue: function (data) {
        var me = this;
        me.value = data || [];
        me.clearError();
    },
    getName: function () {
        var me = this;
        return me.name;
    },

    clearError: function () {
        var me = this;
        var data = me.value;
        if (!Ext.isEmpty(data)) {
            me.unsetActiveError();
            if (me.errorEl) {
                //隐藏错误提示信息的dom
                // me.errorEl.dom.setAttribute('style', 'display: none');
                me.errorEl.up('td').dom.setAttribute('style', 'display: none');
            }
        } else {
            if ((!Ext.isEmpty(me.allowBlank) && !me.allowBlank) && Ext.isEmpty(data)) {
                me.setActiveError('该输入项为必输项');
            }
        }
    },
});