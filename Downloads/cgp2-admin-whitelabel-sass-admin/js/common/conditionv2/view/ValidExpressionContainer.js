/**
 * @Description:输入propertyModelId的校验valueEx组件
 * @author nan
 * @date 2023/6/5
 */
Ext.define('CGP.common.conditionv2.view.ValidExpressionContainer', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.valid_expression_container',
    disabled: false,
    hidden: false,
    layout: {
        type: 'hbox',
        align: 'middle',
        pack: 'center'
    },
    getExpressionData: Ext.emptyFn,//自定义获取expressionData的方法
    initComponent: function () {
        var me = this;
        me.items = [
        ];
        me.callParent();
    },
})