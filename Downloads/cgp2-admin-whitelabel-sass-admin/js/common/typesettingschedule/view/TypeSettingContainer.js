Ext.syncRequire([
    'CGP.common.typesettingschedule.view.OptionalConfigContainer',
    'CGP.common.typesettingschedule.controller.Controller',
    'CGP.common.typesettingschedule.controller.Controller',
    'CGP.common.typesettingschedule.view.DataContainer',
    'CGP.common.typesettingschedule.view.FieldsetContainer',
])
Ext.define('CGP.common.typesettingschedule.view.TypeSettingContainer', {
    extend: 'CGP.common.typesettingschedule.view.OptionalConfigContainer',
    alias: 'widget.type_setting',
    width: '100%',
    layout: 'vbox',
    orderId: null,
    orderItemId: null,
    typeSettingData: null,
    isSwitch: true,
    initExpand: true,
    initComponent: function () {
        var me = this;
        var result = [];
        var data = me.typeSettingData;
        var subTasks = data['subTasks'];
        var controller = Ext.create('CGP.common.typesettingschedule.controller.Controller');
        (subTasks.length > 0) && subTasks.forEach((subTasksItem, index) => {
                me.subTasksItem = subTasksItem;
                var status = subTasks[index]['status'];
                var fieldset = {
                    xtype: 'fieldset_container',
                    data: data,
                    index: index,
                    status: status,
                    subTasks: subTasks,
                    subTasksItem: subTasksItem,
                    listeners: {
                        resize: function (comp) {
                            var panel = comp.ownerCt.ownerCt.ownerCt.ownerCt;
                            var stepbar = panel.getComponent('stepbar');
                            var typesettingLine = stepbar.getComponent('typesettingLine');
                            var height = me.getHeight();
                            typesettingLine.setHeight(height);
                        }
                    }
                };
                result.push(fieldset);
            });
        me.switchFn = function () {
            var btn = this;
            var toolbar = this.ownerCt;
            var outContainer = toolbar.ownerCt;
            var container = outContainer.getComponent('container');
            if (btn.count % 2) {
                container.setDisabled(false);
                container.show();
                btn.setIconCls('icon_spread');
            } else {
                container.setDisabled(true);
                container.hide();
                btn.setIconCls('icon_pack');
            }
            btn.count++;

            var panel = me.ownerCt.ownerCt;
            var stepBar = panel.getComponent('stepbar');
            var typesettingContainer = me.getComponent('container');
            var templateConfigToolBar = me.getComponent('templateConfigToolBar');
            var typesettingLine = stepBar.getComponent('typesettingLine');
            var lineHeight = typesettingContainer.getHeight() + templateConfigToolBar.getHeight();
            var changeHeight = lineHeight < 180 ? 180 : lineHeight;
            typesettingLine.setHeight(me.isSwitch ? 180 : changeHeight);
            me.isSwitch = !me.isSwitch;
        };
        me.titleFn = function () {
            var toolbar = this.ownerCt;
            var outContainer = toolbar.ownerCt;
            var btn = toolbar.getComponent('switchBtn');
            var container = outContainer.getComponent('container');
            if (btn.count % 2) {
                container.setDisabled(false);
                container.show();
                btn.setIconCls('icon_spread');
            } else {
                container.setDisabled(true);
                container.hide();
                btn.setIconCls('icon_pack');
            }
            btn.count++;

            var panel = me.ownerCt.ownerCt;
            var stepBar = panel.getComponent('stepbar');
            var typesettingContainer = me.getComponent('container');
            var templateConfigToolBar = me.getComponent('templateConfigToolBar');
            var typesettingLine = stepBar.getComponent('typesettingLine');
            var lineHeight = typesettingContainer.getHeight() + templateConfigToolBar.getHeight();
            var changeHeight = lineHeight < 180 ? 180 : lineHeight;
            typesettingLine.setHeight(me.isSwitch ? 180 : changeHeight);
            me.isSwitch = !me.isSwitch;
        }
        me.isTimeShow = false;
        me.containerConfig = {
            defaults: {
                margin: '0 25 0 37',
                allowBlank: true,
            },
        }
        me.status = controller.getDataStatus(me.typeSettingData);
        me.title = i18n.getKey('typesetting');
        me.containerItems = result;
        me.callParent(arguments);
    },
})