Ext.syncRequire(['CGP.costenterconfig.method.method']);

Ext.define('CGP.costenterconfig.component.edit.effectiveDuration', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.effectiveduration',
    layout: {
        type: 'table',
        columns: 2,
        tdAttrs: {
            style: {
                'padding-left': '0px',
                'transform':'translateX(-50px)'
            }
        }
    },
    initComponent: function () {
        var me = this;
        var method = Ext.create('CGP.costenterconfig.method.method');
        me.defaults = Ext.Object.merge({
            format: 'Y年m月d日',
            editable: false,
            allowBlank: false,
            width:280,
            diyGetValue: function () {
                var me = this;
                var date = me.getValue().getTime();
                return method.TimestampToTime(date,'POST');
            },
        }, me.defaults);
        me.items = [
            {
                xtype: 'datefield',
                name: 'startTime',
                itemId: 'startTime',
                emptyText: i18n.getKey('startTime'),
                listeners: {
                    change: function () {
                        var me = this;
                        var form = me.ownerCt;
                        var value = me.getValue();
                        var endTime = form.getComponent('endTime');
                        endTime.setMinValue(value);
                        endTime.setDisabled(false);
                    }
                }
            },
            {
                xtype: 'datefield',
                name: 'endTime',
                itemId: 'endTime',
                emptyText: i18n.getKey('endTime'),
                disabled: true,
            },
        ];
        me.callParent();
    }
})