Ext.Loader.setPath({
    enabled: true,
    'CGP.orderdetails': path + 'partials/order/details/app/'
});
Ext.Loader.syncRequire([
    'CGP.orderdetails.view.render.OrderLineItemRender'
])
Ext.define('CGP.order.view.orderlineitem.List', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.orderlineitemlist',
    autoScroll: true,
    width: 2500,
    initComponent: function () {
        var me = this,
            controller = this.controller,
            orderLineItemController = Ext.create('CGP.orderlineitem.controller.OrderLineItem'),
            order = me.order,
            orderId = order.get('id'),
            remark = order.get('remark'),
            orderNumber = order.get('orderNumber'),
            orderStatusId = order.get('statusId'),
            mainRenderer = Ext.create('CGP.orderdetails.view.render.OrderLineItemRender'),
            map = mainRenderer.getOrderItemCfgV2({
                grid: me,
                remark: remark,
                orderId: orderId,
                orderStatusId: orderStatusId
            });

        me.store = Ext.create('CGP.orderlineitemv2.store.OrderLineItemByOrderStore', {
            orderId: orderId
        });
        me.viewConfig = {
            enableTextSelection: true
        };
        me.columns = {
            items: [
                map.get('0'),
                {
                    dataIndex: 'imageUrl',
                    text: i18n.getKey('image'),
                    xtype: 'componentcolumn',
                    width: 150,
                    renderer: function (value, metadata, record) {
                        var image,
                            urlPrefix,
                            orderLineItemUploadStatus = record.get('orderLineItemUploadStatus') || 'none',
                            id = record.get('id'),
                            thumbnail = record.get('thumbnailInfo').thumbnail,
                            itemGenerateStatus = record.get('itemGenerateStatus'),//订单随机定制内容生成状态
                            message = record.get('thumbnailInfo').message,
                            status = record.get('thumbnailInfo').status,
                            productInstanceId = record.get('productInstanceId'),
                            uploadStatus_zh = {
                                Uploaded: {
                                    text: '已上传',
                                    image: 'progress'
                                },
                                PartialUpload: {
                                    text: '部分上传',
                                    image: 'complete'
                                },
                                WaitUploaded: {
                                    text: '等待上传',
                                    image: 'begin'
                                },
                                none: {
                                    text: 'none',
                                    image: 'none'
                                }
                            },
                            allowEditDoc = false,
                            // 生产中及之后的状态
                            paibanIngState = [9358697, 120, 121, 122, 106, 107, 108, 109],
                            isSuccessGenerateStatus = (!itemGenerateStatus) || (itemGenerateStatus === 'SUCCESS'); //老订单没这字段 为空都算成功


                        function checkStringLength(str) {
                            return str?.length > 200 ? `${str}` : '报错信息异常!';
                        }

                        if (orderLineItemUploadStatus !== 'none' && Ext.Array.contains([300, 301], orderStatusId)) {
                            allowEditDoc = true;
                        }

                        if (!Ext.isEmpty(thumbnail)) {
                            urlPrefix = projectThumbServer;
                            image = thumbnail;
                        }

                        if (['', undefined].includes(thumbnail) && !['FAILURE', 'RUNNING'].includes(status)) {
                            status = 'NULL'
                        }

                        var imgSize = '/100/100/png?' + Math.random();
                        var statusGather = {
                            SUCCESS: function () {
                                metadata.tdAttr = 'data-qtip=查看图片';
                                return image ? (urlPrefix + image + imgSize) : (value + imgSize);
                            },
                            FAILURE: function () {
                                metadata.tdAttr = 'data-qtip=' + checkStringLength(JSON.stringify(message));
                                return path + 'js/order/view/orderlineitem/image/FAILURE.jpg'
                            },
                            RUNNING: function () {
                                metadata.tdAttr = 'data-qtip=' + checkStringLength(JSON.stringify(message));
                                return path + 'js/order/view/orderlineitem/image/WAITING.gif'
                            },
                            INIT: function () {
                                return urlPrefix + image + imgSize;
                            },
                            NULL: function () {
                                metadata.tdAttr = 'data-qtip=图片为空';
                                return path + 'js/order/view/orderlineitem/image/NULL.jpg'
                            }
                        }
                        return {
                            xtype: 'panel',
                            border: false,
                            layout: 'vbox',
                            items: [
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'imagecomponent',
                                            src: statusGather[status](),
                                            autoEl: 'div',
                                            style: {
                                                cursor: 'pointer',
                                                border: '1px solid #000',
                                                boxSizing: 'border-box',
                                                overflow: 'hidden',
                                                boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                                            },
                                            margin: '0 10 0 0',
                                            listeners: {
                                                afterrender: function (view) {
                                                    var orderNumber = order.get('orderNumber');
                                                    var seqNo = record.get('seqNo');
                                                    var img = new Image();
                                                    img.src = view.src;
                                                    img.onload = function () {
                                                        if (status === 'SUCCESS' || status === 'INIT') {
                                                            Ext.create('Ext.ux.window.ImageViewer', {
                                                                imageSrc: (urlPrefix + image),
                                                                actionItem: view.el.dom.id,
                                                                winConfig: {
                                                                    title: i18n.getKey('check') + ` < ${orderNumber} - ${seqNo} > 预览图`
                                                                }
                                                            });
                                                        }
                                                        view.el.dom.getElementsByTagName('img')[0].addEventListener('error', function (err) {
                                                            JSCaptureMessage('订单管理界面中，订单' + orderNumber + '序号为' + seqNo + '的订单项加载预览图失败', {
                                                                message: '订单管理界面中，订单' + orderNumber + '序号为' + seqNo + '的订单项加载预览图失败',
                                                                level: 'info',
                                                                tags: {
                                                                    clientUrl: location.href,
                                                                    serverUrl: err.target.src,
                                                                    httpStatusCode: 404,
                                                                    previewImg: 'NotFind'
                                                                },
                                                                extra: {
                                                                    '文件': err.target.src
                                                                }
                                                            });
                                                            return true;
                                                        }, true);
                                                        view.setWidth(img.width)
                                                        view.setHeight(img.height)
                                                    }

                                                    // 当图片加载失败的时候
                                                    img.onerror = function () {
                                                        // 替换为默认图片
                                                        view.setSrc(path + 'js/order/view/orderlineitem/image/FAILURE.jpg?' + new Date().getTime())
                                                        img.src = view.src;
                                                        img.onload = function () {
                                                            view.setWidth(img.width);
                                                            view.setHeight(img.height);
                                                        };
                                                        img.onerror = function () {
                                                            console.error("默认图片加载失败:", img.src);
                                                        };
                                                    };
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'uxfieldcontainer',
                                            layout: 'vbox',
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    itemId: 'refresh',
                                                    iconCls: 'icon_create_path',
                                                    tooltip: '重新生成缩略图',
                                                    componentCls: "btnOnlyIcon",
                                                    margin: '50 30 0 0',
                                                    handler: function () {
                                                        Ext.Msg.confirm(i18n.getKey('提示'), i18n.getKey('是否重新生成缩略图?'), function (selector) {
                                                            if (selector === 'yes') {
                                                                orderLineItemController.reloadImage(productInstanceId, me.store, id);
                                                                me.store.load();
                                                            }
                                                        })
                                                    }
                                                },
                                                {
                                                    xtype: 'button',
                                                    itemId: 'reorder',
                                                    iconCls: 'icon_reset',
                                                    margin: '10 30 0 0',
                                                    tooltip: '重新排版',
                                                    componentCls: "btnOnlyIcon",
                                                    hidden: true, //2026.1.9 隐藏重新排版按钮 查看情况下较少使用该功能
                                                    // hidden: !(isSuccessGenerateStatus && !paibanIngState.includes(orderStatusId)), //需要是随机卡完成 且 排版状态在生产之前
                                                    handler: function () {
                                                        Ext.Msg.confirm(i18n.getKey('提示'), i18n.getKey('是否重新排版? (重排不会清除排版文件)'), function (selector) {
                                                            if (selector === 'yes') {
                                                                orderLineItemController.rePrint(orderId, id, false, function () {
                                                                    Ext.Msg.alert(i18n.getKey('提示'), i18n.getKey('重排请求发起成功,点击进入排版进度!'), function () {
                                                                        var store = Ext.create('CGP.common.typesettingschedule.store.LastTypesettingScheduleStore', {
                                                                            params: {
                                                                                filter: '[{"name":"orderNumber","value":"' + orderNumber + '","type":"string"}]',
                                                                            }
                                                                        });
                                                                        Ext.create('CGP.common.typesettingschedule.TypeSettingGrid', {
                                                                            record: record,
                                                                            gridStore: store,
                                                                            orderId: orderId,
                                                                            statusId: orderStatusId,
                                                                            orderNumber: orderNumber
                                                                        }).show();
                                                                    });
                                                                    me.store.load();
                                                                });
                                                            }
                                                        })

                                                    }
                                                }
                                            ]
                                        },
                                    ]
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '上传状态',
                                    labelWidth: 50,
                                    hidden: !allowEditDoc,
                                    value: '<font color=red>' + uploadStatus_zh[orderLineItemUploadStatus].text + '<font>'
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('edit') + i18n.getKey('userDesign'),
                                    cls: 'a-btn',
                                    hidden: !allowEditDoc,
                                    handler: function () {
                                        var orderLineItemId = record.getId();
                                        var productInstanceId = record.get('productInstanceId');
                                        var order = orderLineItemController.getOrder(orderId);
                                        var url = adminPath + 'api/builder/resource/builder/url/latest' +
                                            '?productInstanceId=' + productInstanceId + '&platform=PC&language=en';
                                        JSAjaxRequest(url, "GET", true, null, null, function (require, success, response) {
                                            if (success) {
                                                var responseText = Ext.JSON.decode(response.responseText);
                                                if (responseText.success) {
                                                    if (Ext.isEmpty(responseText.data)) {
                                                        Ext.Msg.alert('提示', '产品无配置的builder地址。')
                                                    } else {
                                                        Ext.create('CGP.orderlineitem.view.manualuploaddoc.EditProductInstanceWindow', {
                                                            orderLineItemId: orderLineItemId,
                                                            productInstanceId: productInstanceId,
                                                            builderUrl: responseText.data,
                                                            order: order
                                                        }).show();
                                                    }
                                                }
                                            }
                                        }, true);
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('check') + i18n.getKey('edit') + i18n.getKey('history'),
                                    hidden: !allowEditDoc,
                                    cls: 'a-btn',
                                    projectId: record.get('projectId'),
                                    handler: function () {
                                        var orderLineItemId = record.getId();
                                        var productInstanceId = record.get('productInstanceId');
                                        var order = orderLineItemController.getOrder(orderId);
                                        me.showUpdateLineItemHisotries(productInstanceId, orderLineItemId, record.get('updateProductInstanceHistories'), order);
                                    }
                                },
                            ]
                        }
                    }
                },
                map.get('8'),
                map.get('5'),
                map.get('2'),
                map.get('6'),
                map.get('10'),
                map.get('11'),
                map.get('12'), // 0 8 5 2 6 10 11 12
            ],
            defaults: {
                sortable: false,
                menuDisabled: true,
                resizable: true
            }
        };
        me.listeners = {
            afterrender: this.magnificImage
        };
        me.bbar = {
            xtype: 'pagingtoolbar',
            store: me.store
        };
        me.callParent(arguments);
    },
    showUpdateLineItemHisotries: function (productInstanceId, orderLineItemId, updateLineItemHisotries, order) {
        var window = new Ext.window.Window({
            title: i18n.getKey('history'),
            bodyCls: 'padding:10px',
            height: 500,
            width: 700,
            modal: true,//强制不能超载其他区域
            autoScroll: true,
            layout: 'fit',
            items: [
                Ext.create('CGP.order.view.orderlineitem.UpdateLineItemHisotries', {
                    productInstanceId: productInstanceId,
                    orderLineItemId: orderLineItemId,
                    updateLineItemHisotries: updateLineItemHisotries,
                    order: order
                })
            ]
        });
        window.show();
    },
    magnificImage: function (p) {
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
})
