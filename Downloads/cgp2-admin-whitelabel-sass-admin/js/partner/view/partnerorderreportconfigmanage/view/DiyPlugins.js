/**
 * Created by nan on 2018/1/22.
 */
Ext.define('CGP.partner.view.partnerorderreportconfigmanage.view.DiyPlugins', {
    extend: 'Ext.util.Observable',
    init: function (cmp) {
        this.cmp = cmp;
        this.cmp.on('render', this.onRender, this);
    },
    onRender: function () {
        this.cmp.getToolbar().add([
            {
                xtype: 'button',
                iconCls: 'x-form-search-trigger', //your iconCls here
                handler: function () {
                    var localData = {
                        "partnerName": null,
                        "year": 0,
                        "month": 0,
                        "totalCount": 0,
                        "totalPrice": 0.0,
                        "context": {
                            "yearMonth": null,
                            "productSummaries": [
                                {
                                    "productId": [
                                        {
                                        }
                                    ],
                                    "displayName": null,
                                    "price": null,
                                    "qty": 0,
                                    "totalPrice": null
                                }
                            ],
                            "reportDetail": {
                                "dayDetails": [
                                    {
                                        "oneDayDetail": {
                                            "dateFormatString": null,
                                            "productOneDayDetails": [
                                                {
                                                    "productId": [
                                                        {

                                                        }
                                                    ],
                                                    "qty": null
                                                }
                                            ],
                                            "totalQty": null
                                        }
                                    }
                                ],
                                "reportDetailHeaders": [
                                    {

                                    }
                                ]
                            }
                        }
                    };
                    var valueString = JSON.stringify(localData,null,"\t");
                    var win = Ext.create("Ext.window.Window", {
                        id: "layers",
                        layout: 'fit',
                        title: i18n.getKey('可用的占位符'),
                        items: [
                            {
                                xtype: 'textarea',
                                fieldLabel: false,
                                width: 600,
                                height: 400,
                                value: valueString
                            }
                        ]
                    });
                    win.show();
                },
                scope: this,
                tooltip: '查看所有可用占位符',
                overflowText: '查看所有可用占位符'
            }
        ]);
    }
});