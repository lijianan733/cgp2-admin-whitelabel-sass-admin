Ext.define('CGP.promotionrule.controller.MainController', {
    requires: [
        'CGP.promotionrule.view.coupon.Manager'
    ],



    constructor: function () {

        this.callParent(arguments);
    },

    /**
     * 构建优惠政策描述
     */
    buildPolicyString: function (policy) {
        var type = policy.type;
        var discountType = policy.discountType;
        var discount = policy.discount;

        var s = '';
        if (discountType == 1) {
            s = '减免￥' + discount;
        } else {
            s = '折让' + discount + '%';
        }

        switch (type) {
            case 'order':
                s = '订单总金额' + s;
                break;
            case 'product':
                s = '产品金额' + s;
                break;
            case 'shipping':
                s = '运费金额' + s;
                break;
        }
        return s;
    },

    setUrlSearchParam: function (page, searcher) {
        var store = page.grid.getStore(), filter = [];

        if (!(Ext.isEmpty(searcher) || Ext.Object.isEmpty(searcher))) {

            var promotionId = Ext.Number.from(searcher.promotionId);
            if (promotionId) {
                var promotionIdFilter = page.filter.getComponent('promotionId');
                promotionIdFilter.getStore().on('load', function () {
                    promotionIdFilter.select(this.getById(promotionId));
                }, promotionIdFilter.getStore(), {
                    single: true
                })
                filter.push({name: 'promotion.id', value: promotionId, type: 'number'});
            }
        }

        if (filter.length > 0) {
            store.loadPage(1, {
                params: {
                    filter: Ext.JSON.encode(filter)
                }
            });
        } else {
            store.loadPage(1);
        }


    },

    toggleStatus: function (record) {
    	var me = this;
        var preStatus = record.get('active');
        var id = record.get('id');

        Ext.Ajax.request({
            url: adminPath + 'api/admin/promotionRules/' + id + '/toggleStatus',
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response, options) {
                var r = Ext.JSON.decode(response.responseText);
                if (r.success) {
                    record.set('active', !preStatus);
                    record.commit();
                    return null;
                }
                Ext.Msg.alert(i18n.getKey('prompt'), r.message);
            },
            failure: function (response, options) {
                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('serverError'));
            }
        });

    },

    createCoupons: function (ruleId, data, window) {



        Ext.Ajax.request({
            url: adminPath + 'api/admin/promotionRules/' + ruleId + '/coupons',
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: data,
            success: function (response, options) {
                var r = Ext.JSON.decode(response.responseText);
                if (r.success) {
                    var couponList = Ext.ComponentQuery.query('couponlist')[0];
                    couponList.getStore().loadPage(1);
                    window.close();
                    return;
                }
                Ext.Msg.alert(i18n.getKey('prompt'), r.data.message);
            },
            failure: function (response, options) {
                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('serverError'));
            }
        });
    },

    showCouponManager: function (ruleId) {
        Ext.widget({
            xtype: 'couponmanager',
            ruleId: ruleId
        }).show();
    },
    
    showConditionManager : function(record){
    	var win = Ext.create("CGP.promotionrule.view.condition.Manager",{
    		ruleRecord : record
    	});
    	win.show();
    }

})