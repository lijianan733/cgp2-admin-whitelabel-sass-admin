Ext.Loader.setPath({
    enabled: true,
    'CGP.orderdetails': path + 'partials/order/details/app/'
});
Ext.define('CGP.orderlineitem.renderer.MainRenderer', {
    commonController: Ext.create('CGP.orderdetails.view.render.OrderLineItemRender'),

    constructor: function () {

        this.callParent(arguments);
    },

    //item info
    renderItemInfo: function (value, metadata, record) {
        var me = this;
        var orderItemStatusName = record.get('statusName');
        var items = [
            {
                title: i18n.getKey('orderItemStatus'),
                value: '<font color=red>' + i18n.getKey(orderItemStatusName) + '</font>'
            },
            {
                title: i18n.getKey('operator'),
                value: new Ext.Template('<a style="text-decoration: none;" href="javascript:{handler}">{modifyStatus}</a>').apply({
                    handler: 'controller.modifyOrderLineItemStatus(' + record.get('order').id + ')',
                    modifyStatus: i18n.getKey('modifyStatus')
                }),
                tips: i18n.getKey('modifyStatus')
            }
        ];
        return JSCreateHTMLTable(items);
    },

    rendererImage: function (value, metadata, record) {
        var me = this;
        var imgSize = '/100/100/png';
        var image = '';
        var thumbnailInfo = record.get('thumbnailInfo');
        var status = thumbnailInfo?.status;
        var thumbnail = thumbnailInfo?.thumbnail;
        if (['', undefined].includes(thumbnail) && status !== 'FAILURE') {
            status = 'NULL'
        }
        var statusGather = {
            SUCCESS: function () {
                return projectThumbServer + thumbnail + imgSize;
            },
            FAILURE: function () {
                return path + 'js/order/view/orderlineitem/image/FAILURE.jpg'
            },
            INIT: function () {
                return projectThumbServer + thumbnail + imgSize;
            },
            WAITING: function () {
                return path + 'js/order/view/orderlineitem/image/WAITING.gif'
            },
            NULL: function () {
                return path + 'js/order/view/orderlineitem/image/NULL.jpg'
            }
        }
        var imageUrl = statusGather[status]();
        image = {
            xtype: 'imagecomponent',
            src: imageUrl,
            autoEl: 'div',
            tdCls: 'vertical-middle',
            style: 'cursor: pointer',
            width: 100,
            height: 100,
            imgCls: 'imgAutoSize',
            listeners: {
                afterrender: function (view) {
                    if (thumbnail) {
                        var img = new Image();
                        img.src = view.src;
                        img.onload = function () {
                            if (status === 'SUCCESS' || status === 'INIT') {
                                Ext.create('Ext.ux.window.ImageViewer', {
                                    imageSrc: projectThumbServer + thumbnail,
                                    actionItem: view.el.dom.id,
                                    winConfig: {
                                        title: `${i18n.getKey('check')} < ${thumbnail} > 预览图`
                                    },
                                    viewerConfig: null,
                                });
                            }
                            view.setWidth(img.width)
                            view.setHeight(img.height)
                        }

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
            }
        }
        return image;
    },

    renderProductInfo: function (value, metadata, record) {
        var controller = this;
        var orderLineItemStore = record.store;
        var model = record.get('productModel');
        var sku = record.get("productSku");
        if (Ext.isEmpty(window.iframeMessageHandle)) {
            JSAddFrameMessageHandle(function (data) {
                controller.updateCustomCategory(orderLineItemStore, data.orderLineItemId, data.customsCategoryId);
            });
        }
        var items = [
            {
                title: i18n.getKey('name'),
                value: value
            },
            {
                title: i18n.getKey('model'),
                value: model
            },
            {
                title: 'Sku',
                value: sku
            }
        ];
        if (Ext.isEmpty(sku) && !Ext.isEmpty(record.get('materialId'))) {
            items = [
                {
                    title: i18n.getKey('materialName'),
                    value: record.get('materialName')
                },
                {
                    title: i18n.getKey('materialId'),
                    value: record.get('materialId')
                }];
        }
        var isCustomsClearance = record.get('isCustomsClearance');
        if (isCustomsClearance) {//有配置报关要素，且需要报关
            var customsCategoryDTOList = record.get('customsCategoryDTOList');//可选的报关分类列表
            var customsCategoryId = record.get('customsCategoryId');//已经选定报关分类
            if (customsCategoryId) {//明确了报关分类
                var customsCategory = customsCategoryDTOList?.find(function (listItem) {
                    return (listItem._id == customsCategoryId);
                });
                items.push({
                    title: '<font color="red">' + i18n.getKey('customsCategory') + '</font>',
                    value: '<font color="red">' + i18n.getKey(customsCategory.outName) + '</font>'
                });
            } else {//未确定报关分类
                items.push({
                    title: '<font color="red">' + i18n.getKey('customsCategory') + '</font>',
                    value: '<font color="red">' + i18n.getKey('classifyIsNotConfirm') + '</font>'
                });
            }
        }
        return JSCreateHTMLTable(items);
    },

    /**
     * 更新报分类信息
     */
    updateCustomCategory: function (orderLineItemStore, orderLineItemId, customsCategoryId) {
        //当前页是否已经显示，如果已经显示，就直接修改，不然等页面显示后再修改
        var activeTab = top.Ext.getCmp('tabs').getActiveTab();
        var currentTab = null;
        top.Ext.getCmp('tabs').items.items.map(function (item) {
            if (item.id == window.iframeId) {
                currentTab = item;
            }
        });
        if (activeTab == currentTab) {
            var record = orderLineItemStore.findRecord('_id', orderLineItemId);
            if (record) {
                record.set('customsCategoryId', customsCategoryId);
                orderLineItemStore.fireEvent('datachanged', orderLineItemStore);
            }
        } else {
            currentTab.on('show', function () {
                console.log('show');
                var record = orderLineItemStore.findRecord('_id', orderLineItemId);
                if (record) {
                    record.set('customsCategoryId', customsCategoryId);
                    orderLineItemStore.fireEvent('datachanged', orderLineItemStore);
                }
            }, orderLineItemStore, {
                single: true
            });
        }


    },
});
