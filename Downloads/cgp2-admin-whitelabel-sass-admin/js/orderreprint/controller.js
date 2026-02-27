Ext.ns('Qpp.CGP.Order.Controller');



Qpp.CGP.Order.Controller.expandBody = function (rowNode, record, expandRow) {

    var controller = Qpp.CGP.Order.Controller;
    var orderId = record.get('id');

    var orderLineItemDom = document.getElementById('order-line-item-' + orderId);

    if (!orderLineItemDom.innerHTML)
        controller.createOrderLineItemDetail(orderLineItemDom, record);
}


/**
 *创建OrderLineItem的展示表格
 *
 */
Qpp.CGP.Order.Controller.createOrderLineItemDetail = function (dom, order) {

    var orderId = order.get('id');

    var controller = Qpp.CGP.Order.Controller;

    var orderLineItemStore = new Ext.data.Store({
        fields: [{
            name: 'seqNo',
            type: 'int'
        }, 'productName', 'productModel', 'productSku', 'imageUrl', 'projectImage', {
            name: 'price',
            type: 'string'
        }, {
            name: 'amount',
            type: 'string'
        }, {
            name: 'qty',
            type: 'int'
        }, {
            name: 'projectId',
            type: 'int',
            useNull: true
        }, {
            name: 'productAttributeValues',
            type: 'array'
        }, {
            name: 'customAttributeValues',
            type: 'array'
        }],
        data: order.get('lineItems')
    });

    var orderLineItemsGrid = new Ext.grid.Panel({
        autoScroll: true,
        width: 1300,
        renderTo: dom,
        store: orderLineItemStore,
        viewConfig: {
            enableTextSelection: true
        },
        columns: {
            items: [{
                    dataIndex: 'seqNo',
                    autoSizeColumn: true,
                    text: i18n.getKey('seqNo')
            }, {
                    dataIndex: 'imageUrl',
                    text: i18n.getKey('image'),
                    xtype: 'componentcolumn',
                    width: 120,
                    renderer: function (value, metadata, record) {
                        if (Ext.isEmpty(value) && Ext.isEmpty(record.get('projectImage'))) {
                            return '';
                        }
                        var imgSize = '/100/100/png';
                        return {
                            xtype: 'imagecomponent',
                            src: record.get('projectImage') ? (projectThumbServer + record.get('projectImage') + imgSize) : (value + imgSize),
                            autoEl: 'div',
                            style: 'cursor: pointer',
                            width: 100,
                            height: 100,
                            listeners: {
                                el: {
                                    click: function () {
                                        controller.projectPreview(orderId, record.get('projectId'), order.get('websiteCode'));
                                    }
                                }
                            },
                        }
                    }
                            },
                {
                    dataIndex: 'productName',
                    text: i18n.getKey('product'),
                    width: 300,
                    autoWidthComponents: true,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        var model = record.get('productModel');
                        var sku = record.get("productSku");
                        return {
                            xtype: 'form',
                            border: false,
                            defaults: {
                                xtype: 'displayfield',
                                labelAlign: 'right'
                            },
                            items: [{
                                fieldLabel: i18n.getKey('name'),
                                value: value
                    }, {
                                fieldLabel: i18n.getKey('model'),
                                value: model
                    }, {
                                fieldLabel: 'Sku',
                                value: sku
                    }]
                        };
                    }
                            },
                {
                    dataIndex: 'price',
                    text: i18n.getKey('price'),
                    width: 67
                            },
                {
                    dataIndex: 'qty',
                    text: i18n.getKey('qty'),
                    width: 67
                            },
                {
                    dataIndex: 'amount',
                    text: i18n.getKey('amount'),
                    width: 67
                            },
                {
                    tdCls: 'vertical-middle',
                    width: 300,
                    dataIndex: 'productAttributeValues',
                    xtype: 'componentcolumn',
                    text: i18n.getKey('productAttributeValues'),
                    renderer: function (value, metadata) {
                        var items = [];
                        var i;


                        for (i = 0; i < value.length; i++) {
                            if (value[i].name == 'DIY Configuration')
                                continue;
                            items.push({
                                fieldLabel: value[i].name,
                                value: value[i].value
                            });
                        }

                        return {
                            xtype: 'form',
                            border: false,
                            defaults: {
                                xtype: 'displayfield',
                                labelAlign: 'right',
                                labelWidth: 150
                            },
                            items: items
                        }

                    }
                            },
                {

                    width: 200,
                    dataIndex: 'customAttributeValues',
                    xtype: 'componentcolumn',
                    text: i18n.getKey('customAttributeValues'),
                    renderer: function (value, metadata) {

                        var items = [];
                        var i;


                        for (i = 0; i < value.length; i++) {
                            if (value[i].name == 'DiyDesign')
                                continue;
                            items.push({
                                fieldLabel: value[i].name,
                                value: value[i].value
                            });
                        }

                        return {
                            xtype: 'form',
                            border: false,
                            defaults: {
                                xtype: 'displayfield',
                                labelAlign: 'right',
                                labelWidth: 150
                            },
                            items: items
                        }

                    }
                            }],
            defaults: {
                tdCls: 'vertical-middle',
                sortable: false,
                menuDisabled: true,
                resizable: true
            }
        },

        listeners: {
            afterrender: magnificImage
        }
    });

    function magnificImage(p) {
        $('#' + p.getEl().id).magnificPopup({
            type: 'image',
            delegate: 'a.image-item',
            closeOnContentClick: false,
            closeBtnInside: false,
            mainClass: 'mfp-with-zoom mfp-img-mobile',
            image: {
                verticalFit: true
            },
            gallery: {
                enabled: true
            },
            zoom: {
                enabled: true,
                duration: 300, // don't foget to change the duration also in CSS
                opener: function (element) {
                    return element.find('img');
                }
            }
        });
    }

}




Qpp.CGP.Order.Controller.projectPreview = function (orderId, projectId, website) {
    if (!projectId) {
        return;
    }


    var websiteUrl = system.config.website[website.toLowerCase()];

    var html = new Ext.Template('<iframe src="' + system.config.builder_preview + '" width="100%" height="100%"></iframe').apply({
        website: system.config.website[website.toLowerCase()],
        projectId: projectId,
        token: Ext.util.Cookies.get('token')
    });

    var window = new Ext.window.Window({
        width: 800,
        height: 600,
        title: i18n.getKey('preview'),
        html: html
    });

    window.show();
}


/**
 *关闭所有打开的expander
 */
Qpp.CGP.Order.Controller.collapseAllBody = function (grid) {
    var store = grid.getStore();
    var expander = grid.plugins[0];

    for (var i = 0; i < store.getCount(); i++) {
        var record = store.getAt(i);
        if (expander.recordsExpanded[record.internalId]) {
            expander.toggleRow(i, record);
        }
    }
}