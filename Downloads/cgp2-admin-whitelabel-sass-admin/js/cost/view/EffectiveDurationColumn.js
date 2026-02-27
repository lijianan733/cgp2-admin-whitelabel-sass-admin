/**
 * @Description:
 * @author nan
 * @date 2022/9/14
 */
Ext.define('CGP.cost.view.EffectiveDurationColumn', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.effectivedurationcolumn',
    dataIndex: 'effectiveDuration',
    width: 200,
    initComponent: function () {
        var me = this;
        me.width = 200;
        me.callParent();
    },
    renderer: function (value, meteData, record) {
        return Ext.Date.format(new Date(value.startTime), 'Y-m-d') + ' ~ ' + Ext.Date.format(new Date(value.endTime), 'Y-m-d');
    }
})