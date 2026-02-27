/**
 * @Description: 特殊处理时间范围的查询,精确到秒
 * @author nan
 * @date 2023/7/11
 */
Ext.define('CGP.promotion.view.DateRangeV2', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.daterangev2',
    labelWidth: 100,
    defaults: {
        style: 'margin:0'
    },
    initComponent: function () {
        var me = this;
        me.layout = {
            type: 'table',
            columns: 2,
            tdAttrs: {
                style: 'margin:0'
            }
        };
        var totalWidth = me.width - me.labelWidth - me.labelPad;
        var labelWidth = 20;
        me.items = [
            {
                xtype: 'datetimefield',
                name: me.name + '.startDate@from',
                width: (totalWidth - labelWidth) / 2,
                change: me.change,
                format: 'Y/m/d H:i:s',
            },
            {
                xtype: 'datetimefield',
                name: me.name + '.endDate@to',
                fieldLabel: i18n.getKey('reach'),
                change: me.change,
                width: (totalWidth - labelWidth) / 2 + labelWidth,
                labelWidth: labelWidth,
                format: 'Y/m/d H:i:s',
            }
        ];
        me.callParent(arguments);
    }
})