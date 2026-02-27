/**
 * @author xiu
 * @date 2023/8/22
 */
//订单项列表
Ext.Loader.syncRequire([
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.store.OrderLineItem', 
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.singleAddress.splitBarTitle',
    'CGP.orderdetails.view.details.OrderLineItem', 
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.store.DetailsOrderLineItem'
])
Ext.define('CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.singleAddress.newOrderItemList', {
    extend: 'Ext.form.Panel',
    alias: 'widget.newOrderItemList',
    bodyStyle: 'border-top:0;border-color:white;',
    margin: '5 0 50 0',
    shipmentRequirement: null,
    orderId: null,
    orderStatusId: null,
    mainRenderer: Ext.create('CGP.orderdetails.view.render.OrderLineItemRender'), // 控制数据排序
    sortArrayOfObjects: function (arr, sortField, sortDirection) {
        return arr.sort(function (a, b) {
            // 检查字段是否是数字类型
            if (typeof a[sortField] === 'number' && typeof b[sortField] === 'number') {
                if (sortDirection === 'asc') {
                    return a[sortField] - b[sortField];
                } else {
                    return b[sortField] - a[sortField];
                }
            }
        });
    },
    initComponent: function () {
        var me = this,
            {data, shipmentRequirement} = me,
            shipmentRequirementId = shipmentRequirement['id'];

        me.items = [{//订单项信息
            xtype: 'detailsorderlineitem',
            width: '100%',
            maxHeight: 500,
            itemId: 'orderLineInfo',
            diySetValue: Ext.emptyFn,
            diyGetValue: Ext.emptyFn,
            getName: Ext.emptyFn,
            dockedItems: [],
            pageType: 'deliverInfo',
            order: me.order,
            remark: me.remark,
            orderId: me.orderId,
            orderStatusId: me.orderStatusId,
            isShowClickItem: {
                changeUserDesignBtn: false,
                builderPageBtn: true,
                customsCategoryBtn: false,
                viewUserStuffBtn: false,
                buildPreViewBtn: true,
                contrastImgBtn: false,
                builderCheckHistoryBtn: false
            },
            store: Ext.create('CGP.orderstatusmodify.view.orderitemsmultipleaddress.store.DetailsOrderLineItem', {
                shipmentRequirementId: shipmentRequirementId
            }),
            getFieldLabel: function () {
                return '';
            },
        },];
        me.callParent();
    },
})