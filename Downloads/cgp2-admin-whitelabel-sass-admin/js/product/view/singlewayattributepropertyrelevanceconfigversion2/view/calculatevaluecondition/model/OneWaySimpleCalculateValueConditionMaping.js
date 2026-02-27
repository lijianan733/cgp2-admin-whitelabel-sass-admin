/**
 * Created by admin on 2020/8/19.
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.model.OneWaySimpleValueMaping',{
    extend: 'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.model.OneWaySimpleCalculateValueMaping',
    fields: [
        {
            name:'executeCondition',
            type:'object'
        },
        {
            name:'inputGroups',
            type:'array'
        }
    ],
    initComponent: function () {
        var me=this;
        me.callParent(arguments);
    }
})
