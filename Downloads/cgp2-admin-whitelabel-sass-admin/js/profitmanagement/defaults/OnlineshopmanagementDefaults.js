/**
 * @author xiu
 * @date 2025/2/24
 */
Ext.define('CGP.profitmanagement.defaults.OnlineshopmanagementDefaults', {
    //正式配置
    config: {
        qpmn_profit_check: {
            columnsText: [
                /* {
                   text: '序号',
                   type: 'string',
                   name: 'orderNo'
               },*/
                {
                    text: '年月',
                    type: 'string',
                    name: 'settleDate2'
                },
                {
                    text: '是否已结清',
                    type: 'string',
                    name: 'finish',
                    renderer: function (value, metadata, record) {
                        var typeGather = {
                                true: {
                                    color: 'green',
                                    text: '是'
                                },
                                false: {
                                    color: 'red',
                                    text: '否'
                                }
                            },
                            {color, text} = typeGather[value];
                        return JSCreateFont(color, true, text);
                    }
                },
                {
                    text: '总盈余',
                    type: 'string',
                    name: 'amountText'
                },
                {
                    text: '已结算金额',
                    type: 'string',
                    name: 'transferBalanceText'
                },
                {
                    text: '待结算金额',
                    type: 'string',
                    name: 'waitTransferBalanceText'
                },
                {
                    text: '他月转入总盈余',
                    type: 'string',
                    name: 'inTransferBalanceText'
                },
                {
                    text: '当月转出总盈余',
                    type: 'string',
                    name: 'outTransferBalanceText'
                },
                {
                    text: '已结清的partner数量',
                    type: 'link',
                    name: 'squaredPartner',
                    renderer: function (value, metaData, record) {
                        metaData.tdAttr = 'data-qtip="' + `跳转至每月盈余情况页` + '"';
                        return JSCreateHyperLink(value);
                    },
                    clickHandler: function (value, metadata, record) {
                        var id = record.get('id'),
                            month = record.get('month'),
                            year = record.get('year');

                        JSOpen({
                            id: 'monthly_profit_casepage',
                            title: i18n.getKey('每月盈余情况'),
                            url: path + 'partials/profitmanagement/monthly_profit_case.html' +
                                '?year=' + year +
                                '&month=' + month,
                            refresh: true
                        })
                    }
                },
            ],
            filtersText: []
        },
        monthly_profit_case: {
            columnsText: [
                /* {
                   text: '序号',
                   type: 'string',
                   name: 'orderNo'
               },*/
                {
                    text: 'partner ID',
                    type: 'link',
                    name: 'partnerId',
                    renderer: function (value, metaData, record) {
                        metaData.tdAttr = 'data-qtip="' + `跳转至Partner盈余总览页` + '"';
                        return JSCreateHyperLink(value);
                    },
                    clickHandler: function (value, metadata, record) {
                        var partnerEmail = record.get('partnerEmail');
                        JSOpen({
                            id: 'partner_profit_checkpage',
                            title: i18n.getKey('Partner盈余总览'),
                            url: path + 'partials/profitmanagement/partner_profit_check.html' +
                                '?partnerId=' + value +
                                '&partnerEmail=' + partnerEmail,
                            refresh: true
                        })
                    }
                },
                {
                    text: '邮箱',
                    type: 'string',
                    name: 'partnerEmail',
                },
                {
                    text: '盈余',
                    type: 'string',
                    name: 'amountText'
                },
                {
                    text: '是否已结清',
                    type: 'string',
                    name: 'isSettled',
                    renderer: function (value, metadata, record) {
                        var typeGather = {
                                true: {
                                    color: 'green',
                                    text: '是'
                                },
                                false: {
                                    color: 'red',
                                    text: '否'
                                }
                            },
                            {color, text} = typeGather[value];
                        return JSCreateFont(color, true, text);
                    }
                },
                {
                    text: '未结清金额',
                    type: 'string',
                    name: 'waitTransferBalanceText'
                },
                {
                    text: '他月转入总盈余',
                    type: 'string',
                    name: 'inTransferBalanceText'
                },
                {
                    text: '当月转出总盈余',
                    type: 'string',
                    name: 'outTransferBalanceText'
                },
                {
                    text: '操作',
                    type: 'container',
                    name: 'partnerId',
                    width: 320,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                        var finish = record.get('isSettled'),
                            partnerEmail = record.get('partnerEmail'),
                            year = record.get('year'),
                            month = record.get('month'),
                            amount = record.get('amount'),
                            symbolLeft = record.get('symbolLeft'),
                            waitTransferBalance = record.get('waitTransferBalance'),
                            isSHideSquareBtn = finish || waitTransferBalance < 100,
                            controller = Ext.create('CGP.profitmanagement.controller.Controller')

                        return {
                            xtype: 'fieldcontainer',
                            defaults: {
                                margin: '0 5 0 5',
                            },
                            layout: {
                                type: 'hbox', // 使用 hbox 布局
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('结算'),
                                    itemId: 'square',
                                    disabled: waitTransferBalance < 100,
                                    hidden: finish,
                                    flex: 1,
                                    handler: function () {
                                        var params = {
                                            partnerId: value,
                                            year: year,
                                            month: month,
                                        }
                                        controller.createPartnerSquaredWindow(params, function () {
                                            store.load();
                                        });
                                    }
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'icon_help',
                                    hidden: finish || waitTransferBalance > 100,
                                    componentCls: 'btnOnlyIconV2',
                                    width: 30,
                                    margin: 0,
                                    tooltip: '结算金额小于US$100时,不允许结算,只能通过转入到下个结算月进行结算!'
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('修改盈余'),
                                    itemId: 'editProfit',
                                    flex: 1,
                                    minWidth: 70,
                                    tooltip: '跳转_修改盈余',
                                    handler: function () {
                                        console.log(view.ownerCt);
                                        JSOpen({
                                            id: "edit_profit_check",
                                            url: path + 'partials/profitmanagement/edit_profit_check.html' +
                                                '?year=' + year +
                                                '&month=' + month +
                                                '&amount=' + amount +
                                                '&symbolLeft=' + symbolLeft +
                                                '&partnerEmail=' + partnerEmail +
                                                '&waitTransferBalance=' + waitTransferBalance +
                                                '&openPage=' + 'monthly_profit_case' +
                                                '&type=' + 'edit' +
                                                '&partnerId=' + value,
                                            title: i18n.getKey(`修改盈余(${value})`),
                                            refresh: true
                                        });
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('盈余转到未结算月'),
                                    itemId: 'moveProfit',
                                    hidden: finish,
                                    flex: 2,
                                    handler: function () {
                                        controller.createMoveProfitWindow(record, function () {
                                            /*JSOpen({
                                                id: 'monthly_profit_casepage',
                                                title: i18n.getKey('每月盈余情况'),
                                                url: path + 'partials/profitmanagement/monthly_profit_case.html' +
                                                    '?year=' + year +
                                                    '&month=' + month,
                                                refresh: true
                                            })*/
                                            store.load();
                                        });
                                    }
                                }
                            ]
                        }
                    }
                },
            ],
            filtersText: [
                {
                    text: 'Partner邮箱',
                    name: 'partnerEmail',
                    type: 'string',
                    // isLike: true
                },
                {
                    text: 'Partner ID',
                    name: 'partnerId',
                    type: 'number'
                },
            ]
        },
        partner_profit_check: {
            columnsText: [
                /* {
                   text: '序号',
                   type: 'string',
                   name: 'orderNo'
               },*/
                {
                    text: '年月',
                    type: 'string',
                    name: 'settleDate'
                },
                {
                    text: '是否已结清',
                    type: 'string',
                    name: 'isSettled',
                    renderer: function (value, metadata, record) {
                        var typeGather = {
                                true: {
                                    color: 'green',
                                    text: '是'
                                },
                                false: {
                                    color: 'red',
                                    text: '否'
                                }
                            },
                            {color, text} = typeGather[value];
                        
                        return JSCreateFont(color, true, text);
                    }
                },
                {
                    text: '总盈余',
                    type: 'string',
                    name: 'amountText'
                },
                {
                    text: '扣除手续费后盈余',
                    type: 'string',
                    name: 'deductionOfFeeAmount'
                },
                {
                    text: '已结算金额',
                    type: 'string',
                    name: 'transferBalanceText'
                },
                {
                    text: '待结算金额',
                    type: 'string',
                    name: 'waitTransferBalanceText'
                },
                {
                    text: '他月转入总盈余',
                    type: 'string',
                    name: 'inTransferBalanceText'
                },
                {
                    text: '当月转出总盈余',
                    type: 'string',
                    name: 'outTransferBalanceText'
                },
                {
                    text: '操作',
                    type: 'container',
                    name: 'settleDate',
                    width: 320,
                    renderer: function (value, metaData, record) {
                        var finish = record.get('isSettled'),
                            partnerId = JSGetQueryString('partnerId'),
                            partnerEmail = JSGetQueryString('partnerEmail'),
                            year = record.get('year'),
                            month = record.get('month'),
                            amount = record.get('amount'),
                            symbolLeft = record.get('symbolLeft'),
                            waitTransferBalance = record.get('waitTransferBalance'),
                            isHideSquareBtn = finish || waitTransferBalance < 100,
                            controller = Ext.create('CGP.profitmanagement.controller.Controller')

                        return {
                            xtype: 'fieldcontainer',
                            defaults: {
                                margin: '0 5 0 5',
                            },
                            layout: {
                                type: 'hbox', // 使用 hbox 布局
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('结算'),
                                    itemId: 'square',
                                    // hidden: isSHideSquareBtn,
                                    disabled: waitTransferBalance < 100,
                                    hidden: finish,
                                    flex: 1,
                                    handler: function () {
                                        var params = {
                                            partnerId: partnerId,
                                            year: year,
                                            month: month,
                                        }
                                        controller.createPartnerSquaredWindow(params);
                                    }
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'icon_help',
                                    hidden: finish || waitTransferBalance > 100,
                                    componentCls: 'btnOnlyIconV2',
                                    width: 30,
                                    margin: 0,
                                    tooltip: '结算金额小于US$100时,不允许结算,只能通过转入到下个结算月进行结算!'
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('修改盈余'),
                                    itemId: 'editProfit',
                                    flex: 1,
                                    minWidth: 70,
                                    tooltip: '跳转_修改盈余',
                                    handler: function () {
                                        JSOpen({
                                            id: "edit_profit_check",
                                            url: path + 'partials/profitmanagement/edit_profit_check.html' +
                                                '?year=' + year +
                                                '&month=' + month +
                                                '&amount=' + amount +
                                                '&symbolLeft=' + symbolLeft +
                                                '&partnerEmail=' + partnerEmail +
                                                '&waitTransferBalance=' + waitTransferBalance +
                                                '&openPage=' + 'partner_profit_check' +
                                                '&type=' + 'edit' +
                                                '&partnerId=' + partnerId,
                                            title: i18n.getKey(`修改盈余(${partnerId})`),
                                            refresh: true
                                        });
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('盈余转到未结算月'),
                                    itemId: 'moveProfit',
                                    hidden: finish,
                                    flex: 2,
                                    handler: function () {
                                        record.set('partnerId', partnerId);
                                        record.set('partnerEmail', partnerEmail);
                                        controller.createMoveProfitWindow(record);
                                    }
                                }
                            ]
                        }
                    }
                },
            ],
            filtersText: []
        },
        partner_profit_info: {
            columnsText: [
                /* {
                   text: '序号',
                   type: 'string',
                   name: 'orderNo'
               },*/
                {
                    text: '类型',
                    type: 'string',
                    name: 'typeText',
                    width: 120
                },
                {
                    text: '操作金额',
                    type: 'string',
                    name: 'nowMoneyText',
                    width: 260
                },
                {
                    text: '当前盈余总额',
                    type: 'string',
                    name: 'moneyText',
                    width: 260
                },
                {
                    text: '扣除手续费后总额',
                    type: 'string',
                    name: 'deductionOfFeeAmount'
                },
                {
                    text: '时间',
                    type: 'date',
                    name: 'operateDate',
                    isSortable: true,
                    width: 260
                },
                {
                    text: '描述',
                    type: 'string',
                    name: 'description',
                },
                {
                    text: '内部备注',
                    type: 'string',
                    name: 'remark',
                },
            ],
            filtersText: []
        },
        query_partner_window: {
            columnsText: [
                {
                    text: 'Partner ID',
                    type: 'string',
                    name: 'id',
                },
                {
                    text: '邮箱',
                    type: 'string',
                    name: 'email'
                },
                {
                    text: '名称',
                    type: 'string',
                    name: 'name'
                },
            ],
            filtersText: [
                {
                    text: 'Partner ID',
                    name: 'id',
                    type: 'number',
                    isLike: true
                },
                {
                    text: '邮箱',
                    name: 'email',
                    type: 'string',
                    isLike: true
                },
                {
                    text: '网站来源',
                    name: 'platform',
                    type: 'string',
                    isLike: true,
                    value: 'QPMN',
                    hidden: true
                },
            ]
        },
    },
    //测试配置
    test: {
        id: 12345
    }
})