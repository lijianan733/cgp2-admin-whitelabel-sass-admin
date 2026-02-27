Ext.Loader.syncRequire([
    'CGP.orderdetails.view.render.EditDesignBtn',
    'CGP.order.view.order.CreateWindow'
])
Ext.define('CGP.orderdetails.view.render.OrderLineItemRender', {
    requires: ['CGP.customscategory.model.CustomsCategory'],
    order: null,//用于保存加载的order数据
    //修改
    editQuery: function (url, jsonData, isEdit) {
        var data = [],
            method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';

        JSAjaxRequest(url, method, true, jsonData, successMsg, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText.data.content || responseText.data;
                    console.log(data);
                }
            }
        }, true);
    },

    //异步修改存在加载动画
    asyncEditQuery: function (url, jsonData, isEdit, callFn) {
        var method = isEdit ? 'PUT' : 'POST';

        JSAjaxRequest(url, method, true, jsonData, false, callFn, true, {timeout: 600000});
    },

    //查询
    getQuery: function (url) {
        var data = [];

        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText?.data?.content || responseText?.data;
                }
            }
        })
        return data;
    },

    //删除
    deleteQuery: function (url) {
        JSAjaxRequest(url, 'DELETE', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    console.log(responseText.data.content || responseText.data);
                }
            }
        }, true)
    },

    //获取url
    getUrl: function (author) {
        var urlGather = {
            mainUrl: adminPath + 'api/colors',

        }
        return urlGather[author];
    },

    constructor: function () {
        this.callParent(arguments);
    },
    /**
     *
     * @param imageUrl 图片路径
     * @param isShowCustomsCategory 是否是可以显示报关要素的订单状态
     * @param isNeedCustoms 配置的报关要素中是否需要出关
     * @param isCustomsCategoryCanMultiSelect 报关要素中的报关分类是否有多个
     * @param customsCategoryDTOList 报关分类列表
     * @param customsCategoryId 已选择了的报关分类id
     * @param orderLineItemId 订单项id
     * @param orderLineItemStore 上个窗口中的订单项store
     */
    diyIimagePreview: function (imageUrl, isShowCustomsCategory, isNeedCustoms, isCustomsCategoryCanMultiSelect,
                                customsCategoryDTOList, customsCategoryId, orderLineItemId, orderLineItemStore) {
        var img = new Image();
        img.onload = function () {
            var me = this;
            if (me.width == 650) {
                var width = me.width;
                var height = me.height;
            } else {
                var multiple = 650 / me.width;
                var width = me.width * multiple;
                var height = me.height * multiple;
            }
            var imageItems = [];
            var image = {
                xtype: 'image',
                src: imageUrl,
                height: height,
                width: width * imageUrl.split(';').length
            };
            imageItems.push(image);
            var window = new Ext.window.Window({
                modal: true,
                autoScroll: true,
                height: 650,
                listeners: {
                    maximize: function (win) {
                        var bodyWidth = Ext.getBody().getWidth(),
                            maxImage = image;
                        maxImage.width = bodyWidth;

                        var multiple = bodyWidth / me.width;
                        maxImage.height = me.height * multiple;
                        win.removeAll();
                        win.add(maxImage);
                    },
                    restore: function (win) {
                        win.removeAll();
                        image.width = 650;

                        var multiple = 650 / me.width;
                        image.height = me.height * multiple;
                        win.add(image);
                    }
                },
                maximizable: true,
                width: 680,
                title: i18n.getKey('preview'),
                items: imageItems,
                bbar: {
                    //是否需要显示报关相关业务，需要报关，且有多个报关分类可供选择时显示
                    hidden: (JSGetQueryString('editable') == 'false') || (!(isShowCustomsCategory && isNeedCustoms && isCustomsCategoryCanMultiSelect)),
                    items: [
                        {
                            xtype: 'combo',
                            store: Ext.create('Ext.data.Store', {
                                fields: [
                                    {
                                        name: '_id',
                                        type: 'string'
                                    },
                                    {
                                        name: 'outName',
                                        type: 'string'
                                    }
                                ],
                                data: customsCategoryDTOList
                            }),
                            valueField: '_id',
                            itemId: 'customsCategoryCombo',
                            displayField: 'outName',
                            editable: false,
                            emptyText: '--select--',
                            value: customsCategoryId,
                            fieldLabel: i18n.getKey('select') + i18n.getKey('customsCategory')
                        },
                        {
                            xtype: 'button',
                            text: i18n.getKey('保存分类'),
                            handler: function (btn) {
                                var customsCategoryId = btn.ownerCt.getComponent('customsCategoryCombo').getValue();
                                if (!Ext.isEmpty(customsCategoryId)) {
                                    var url = adminPath + 'api/orderItems/' + orderLineItemId + '/checkCustomsCategory' +
                                        '?customsCategoryId=' + customsCategoryId;
                                    JSAjaxRequest(url, "PUT", true, null, i18n.getKey('saveSuccess'), function (require, success, response) {
                                        if (success) {
                                            var responseText = Ext.JSON.decode(response.responseText);
                                            if (responseText.success) {
                                                JSSendFrameMessage('all', {
                                                    orderLineItemId: orderLineItemId,
                                                    customsCategoryId: customsCategoryId
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    ]
                }
            });
            window.show();
        };

        img.src = imageUrl;
    },
    //item info
    getCheckCostInfoPermission: function () {
        // 默认获取存在最外层的权限
        var result = top?.window?.permissions?.buttons?.checkCostInfo;
        // 如果没有便重新请求权限
        if (!top?.window?.permissions) {
            /* var permissions = Ext.create('CGP.order.controller.Permission');
             top.window.permissions = permissions;
             result = permissions.buttons.checkCostInfo;*/
        }
        return result;
    },

    renderItemInfo: function (value, metadata, record) {
        var me = this,
            qty = record.get('qty'),
            priceStr = record.get('priceStr'),
            weightStr = record.get('weightStr'),
            totalWeightStr = record.get('totalWeightStr'),
            amountStr = record.get('amountStr'),
            paibanStatus = record.get('paibanStatus'),
            productCostingStr = record.get('productCostingStr') || '',
            checkCostInfoPermission = me.getCheckCostInfoPermission(),
            statusNameGather = {
                4: {
                    color: 'green',
                    text: i18n.getKey('排版成功'),
                },
                3: {
                    color: 'red',
                    text: i18n.getKey('排版失败'),
                },
                2: {
                    color: 'blue',
                    text: i18n.getKey('正在排版'),
                },
                1: {
                    color: 'grey',
                    text: i18n.getKey('等待排版'),
                },
            },
            {color, text} = statusNameGather[paibanStatus || 1],
            statusName = JSCreateFont(color, true, text),
            itemsGather = [
                {
                    title: 'orderedQty',
                    value: qty
                },
                {
                    title: 'weight',
                    value: weightStr
                },
                {
                    title: '总重',
                    value: totalWeightStr
                },
                {
                    title: 'price',
                    value: priceStr
                },
                {
                    title: 'amount',
                    value: amountStr
                },
            ],
            items = [];

        itemsGather.forEach(item => {
            var {title, value} = item;
            value && items.push({
                title: i18n.getKey(title),
                value: JSCreateFont('#000', true, value),
            })
        });

        if (checkCostInfoPermission && productCostingStr) {
            items.splice(3, 0, {
                title: i18n.getKey('成本'),
                value: JSCreateFont('#000', true, productCostingStr),
            })
        }
        return JSCreateHTMLTable(items);
    },

    renderItemStatus: function (value, metadata, record) {
        var me = this,
            orderItemId = record.get('_id'),
            orderItemStatusName = i18n.getKey(record.get('statusName')),
            paibanStatus = record.get('paibanStatus'),
            productInstanceId = record.get('productInstanceId'),
            // randomCardStatus = record.get('randomCardStatus'),
            randomCardStatus = 3,
            randomCardErrorInfo = '已失败错误信息!',
            paibanStatusGather = {
                4: {
                    color: 'green',
                    text: i18n.getKey('排版成功'),
                },
                3: {
                    color: 'red',
                    text: i18n.getKey('排版失败'),
                },
                2: {
                    color: 'blue',
                    text: i18n.getKey('正在排版'),
                },
                1: {
                    color: 'grey',
                    text: i18n.getKey('等待排版'),
                },
            },
            randomCardStatusGather = {
                4: {
                    color: 'green',
                    text: i18n.getKey('已完成'),
                },
                3: {
                    color: 'red',
                    text: `<div style="display:flex">${i18n.getKey('已失败')}&nbsp&nbsp${JSCreateHyperLink('重试')}&nbsp<div data-qtip="${randomCardErrorInfo}" class="icon_errorInfo" style="display:flex;width: 17px;height:17px"></div></div>`,
                },
                2: {
                    color: 'blue',
                    text: i18n.getKey('进行中'),
                },
                1: {
                    color: 'grey',
                    text: i18n.getKey('等待中'),
                },
            },
            {color, text} = paibanStatusGather[paibanStatus || 1],
            randomCardStyle = randomCardStatusGather[randomCardStatus || 1],
            randomCardColor = randomCardStyle?.color,
            randomCardText = randomCardStyle?.text,
            paibanStatusName = JSCreateFont(color, true, text),
            randomStatusName = JSCreateFont(randomCardColor, true, randomCardText),
            isLock = record.get('isLock'),
            lockText = isLock ? `${JSCreateFont('red', true, '(已锁定)')}` : '',
            items = [
                {
                    title: i18n.getKey('订单项编号'),
                    value: orderItemId + lockText
                },
                {
                    title: i18n.getKey('订单项状态'),
                    value: '<font color=red>' + orderItemStatusName + '</font>'
                },
                {
                    title: i18n.getKey('排版状态'),
                    value: paibanStatusName
                },
                {
                    title: i18n.getKey('productInstanceId'),
                    value: productInstanceId
                }
            ];

        /*if (randomCardStatus) { //存在随机卡状态时显示
            items.push({
                title: i18n.getKey('随机内容生成状态'),
                value: randomStatusName
            })
        }*/

        return JSCreateHTMLTableV2(items, 'right', 'auto', true);
    },

    getImageStatusAndUrl: function (thumbnail, status, isInstancePreview) {
        var newStatus = status,
            newImgSrc = '',
            newThumbnailUrl = projectThumbServer + thumbnail,
            imgSize = '/100/100/png';

        if (['', undefined].includes(thumbnail) && !['FAILURE', 'RUNNING'].includes(newStatus)) {
            newStatus = 'NULL'
        }

        if (isInstancePreview===false) {
            newThumbnailUrl = imageServer + thumbnail;
        }

        var statusGather = {
                SUCCESS: function () {
                    return newThumbnailUrl;
                },
                FAILURE: function () {
                    return path + 'js/order/view/orderlineitem/image/FAILURE.jpg';
                },
                INIT: function () {
                    return newThumbnailUrl;
                },
                RUNNING: function () {
                    return path + 'js/order/view/orderlineitem/image/WAITING.gif'
                },
                NULL: function () {
                    return path + 'js/order/view/orderlineitem/image/NULL.jpg';
                }
            },
            imageUrl = statusGather[newStatus]();

        if (newStatus === 'RUNNING') {
            newImgSrc = imageUrl
        } else {
            newImgSrc = imageUrl + imgSize + "?" + Math.random();
        }

        return {
            status: newStatus,
            imgSrc: newImgSrc,
            thumbnailUrl: newThumbnailUrl
        }
    },

    /**
     * status ['43', '100', '101', '113', '116', '117', '118', '300']
     * 新的报关下单，根据下单时的产品的报关要素，和下单时是否有传国外的销售金额来确定订单项是否需要报关
     * 标识字段为isCustomsClearance;
     * 旧的订单是否需要报关是直接根据关联的产品的报关要素来进行判断
     * @param value
     * @param metadata
     * @param record
     * @param isShowClickItem object 是否永久隐藏点击
     * isShowClickItem:{
     *     changeUserDesignBtn: true,
     *     builderPageBtn:true,
     *     customsCategoryBtn:true,
     *     viewUserStuffBtn:true,
     *     buildPreViewBtn:true,
     *     contrastImgBtn:true,
     *     builderCheckHistoryBtn:true
     * }
     * @param isDeliverInfo boolean 是否是发货详情页
     * @param isCompImage boolean 是否是组件图
     * @returns {*}
     */
    rendererImage: function (value, metadata, record, isShowClickItem, isDeliverInfo, isCompImage) {
        var me = this,
            customsCategoryDTOList = record.get('customsCategoryDTOList'),
            isFinishedProduct = record.get('isFinishedProduct'), //是否是成品单
            imageUrl = value,
            orderStatusId = record.get('orderStatusId'),
            isShowCustomsCategory = Ext.Array.contains(['43', '100', '110', '101', '113', '116', '117', '118', '300', '301'], String(orderStatusId)),//获取订单状态
            orderLineItemId = record.get('_id'), productInstanceId = record.get('productInstanceId'),
            thumbnailInfo = record.get('thumbnailInfo'),
            isNeedCustoms = null,//是否需要报关
            /**
             * 是否是报关订单：看下单的时候是否该订单项有报关金额和订单是否有报关货币，
             * 如果都有的话才是报关订单项，否则不是报关订单项
             * 这个字段是后来用来标识这个订单项是否需要报关的
             */
            orderLineItemStore = record.store,
            customsCategoryId = record.get('customsCategoryId'),
            isConfirmCustomsCategory = !Ext.isEmpty(customsCategoryId),//报关分类是否已经确定
            projectUrl = thumbnailInfo?.thumbnail,
            isCustomsCategoryCanMultiSelect = !!(customsCategoryDTOList && customsCategoryDTOList.length > 0),//默认有多个订单分类
            image = '',
            orderId = record.get('orderId'),
            statusId = record.get('statusId'),
            orderNumber = record.get('orderNumber'),
            orderItemId = record.get('_id'),
            isSupportBuilder = record.get('isSupportBuilder'),
            isHidePreview = top.pageType === 'preview', //是否隐藏生产预览
            isInstancePreview = thumbnailInfo?.isInstancePreview,
            originStatus = thumbnailInfo?.status,
            thumbnail = thumbnailInfo?.thumbnail,
            // isSupportBuilder表示该单会由三个渠道(api,store,builder)下单 其api下的单后续需要可查看bulider预览 该字段就是判断该单是否可查看生产预览和用户设计
            isShowPreviewAndUserDesign = !isHidePreview && isSupportBuilder,
            isHideUserDesignStatus = !Ext.Array.contains([43, 100, 110, 101, 113, 116, 117, 118, 300, 301], record.get('orderStatusId')), //包含的状态才显示
            isShowUserDesign = !isHideUserDesignStatus && isSupportBuilder,
            {imgSrc, status} = me.getImageStatusAndUrl(thumbnail, originStatus, isInstancePreview);

        //最终根据这个字段来判断，因为之前的订单没该字段
        if (!Ext.isEmpty(record.get('isCustomsClearance'))) {
            //如果有该字段，说明是新的报关逻辑的订单
            isNeedCustoms = record.get('isCustomsClearance');
        }

        //处理成品单按钮显示
        if (isFinishedProduct) {
            isShowClickItem = {
                changeUserDesignBtn: false,
                builderPageBtn: false,
                builderCheckHistoryBtn: false,
                customsCategoryBtn: true,
                viewUserStuffBtn: true,
                buildPreViewBtn: true,
                contrastImgBtn: true,
            }
        }

        image = {
            xtype: 'panel',
            border: false,
            layout: 'vbox',
            items: [
                {
                    xtype: 'imagecomponent',
                    autoEl: 'div',
                    src: imgSrc,
                    width: 100,
                    height: 100,
                    style: {
                        cursor: 'pointer',
                        border: '1px solid #000',
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                    },
                    listeners: {
                        afterrender: function (view) {
                            var orderNumber = record.get('orderNumber');
                            var orderItemId = record.get('id');

                            var img = new Image();
                            img.src = view.src;
                            img.onload = function () {
                                if (status === 'SUCCESS' || status === 'INIT') {
                                    Ext.create('Ext.ux.window.ImageViewer', {
                                        imageSrc: imageUrl,
                                        actionItem: view?.el?.dom?.id,
                                        winConfig: {
                                            title: `${i18n.getKey('check')} < ${thumbnail} > 预览图`
                                        },
                                        viewerConfig: null,
                                    });
                                }

                                view.el.dom.getElementsByTagName('img')[0].addEventListener('error', function (err) {
                                    JSCaptureMessage('订单' + orderNumber + '的订单详情页面,加载订单项' + orderItemId + '预览图失败', {
                                        message: '订单' + orderNumber + '的订单详情页面,加载订单项' + orderItemId + '预览图失败',
                                        level: 'info',
                                        tags: {
                                            clientUrl: location.href,
                                            serverUrl: err.target.src,
                                            httpStatusCode: 404
                                        },
                                        extra: {
                                            '文件': err.target.src
                                        }
                                    })
                                    return false;
                                }, false);

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
                },
                //对比图
                {
                    xtype: 'imagecomponent',
                    autoEl: 'div',
                    style: 'cursor: pointer',
                    width: 100,
                    height: 100,
                    hidden: true,
                    //  src: 'https://www.qpmarketnetwork.com/file/file/474e7d958f883b977d3d60c342a9e096.jpeg',
                    listeners: {
                        afterrender: function (view) {
                            var pictures = document.getElementById(view.el.dom.id);
                            var imgNode = pictures.getElementsByTagName('img');
                            me.imgNode1 = imgNode[0];
                            me.pictures1 = pictures;
                        }
                    },
                },
                //预览图
                {
                    xtype: 'imagecomponent',
                    autoEl: 'div',
                    style: 'cursor: pointer',
                    width: 100,
                    height: 100,
                    hidden: true,
                    //src: projectThumbServer + '651120b0-710f-41f2-b1d9-29c53a95824c-0.jpg',
                    listeners: {
                        afterrender: function (view) {
                            var pictures = document.getElementById(view.el.dom.id),
                                imgNode = pictures.getElementsByTagName('img');
                            me.imgNode2 = imgNode[0];
                            me.pictures2 = pictures;
                        }
                    },
                },
                //对比图
                {
                    xtype: 'button',
                    text: i18n.getKey('check') + i18n.getKey('contrastImg'),
                    cls: 'a-btn',
                    listeners: {
                        afterrender: function (view) {
                            view.imgNode1 = me.imgNode1;
                            view.imgNode2 = me.imgNode2;
                            view.pictures1 = me.pictures1;
                            view.pictures2 = me.pictures2;
                        }
                    },
                    itemId: 'contrastImgBtn',
                    handler: function (btn) {
                        var customerImageId = 'customerImageId',
                            produceImageId = 'produceImageId';

                        function createImage(id) {
                            return Ext.Object.merge({
                                title: true,
                                button: false,
                                navbar: false,
                                toolbar: true,
                                fullscreen: false,
                                container: id + '-body'
                            });
                        }

                        var productInstanceInfo = me.getProductInstanceInfo(productInstanceId, ['comparisonThumbnail']);
                        if (Ext.isEmpty(productInstanceInfo?.comparisonThumbnail)) {
                            Ext.Msg.alert('提醒', '缺少对比图');
                        } else {
                            me.imgNode1.src = productInstanceInfo?.comparisonThumbnail;
                            me.imgNode2.src = imageUrl;
                            Ext.create('CGP.orderdetails.view.lineitem.CheckContrastImage', {
                                customerImageId: customerImageId,
                                produceImageId: produceImageId,
                            })
                            me.options1 = createImage(customerImageId);
                            me.options2 = createImage(produceImageId);
                            new window.Viewer(btn.pictures1, me.options1);
                            new window.Viewer(btn.pictures2, me.options2);
                            var event = new MouseEvent('click', {
                                button: 1,
                                view: window,
                                bubbles: true,
                                cancelable: false
                            });
                            // 模拟点击
                            btn.imgNode1.dispatchEvent(event);
                            btn.imgNode2.dispatchEvent(event);
                        }
                    }
                },
                //查看用户设计
                {
                    xtype: 'button',
                    text: i18n.getKey('check') + i18n.getKey('builder') + i18n.getKey('preview'),
                    cls: 'a-btn',
                    hidden: !isShowPreviewAndUserDesign,
                    itemId: 'buildPreViewBtn',
                    handler: function () {
                        var builderId = 'builderPreview',
                            tabs = top.parent.Ext.getCmp('tabs'),
                            title = i18n.getKey('builder') + i18n.getKey('preview'),
                            newUrl = me.getBuilderUrl(productInstanceId),
                            tab = tabs.getComponent(builderId);

                        if (!tab) {
                            tab = tabs.add({
                                id: builderId,
                                origin: origin,
                                title: title,
                                html: '<iframe id="tabs_iframe_' + builderId + '" src="' + newUrl + '" width="100%" height="100%""></iframe>',
                                closable: true
                            })
                        } else {
                            tab.update('<iframe id="tabs_iframe_' + builderId + '" src="' + newUrl + '" width="100%" height="100%""></iframe>');
                            tab.setTitle(title);
                        }
                        tabs.setActiveTab(tab);
                    }
                },
                //用户素材图
                {
                    xtype: 'button',
                    text: i18n.getKey('viewUserStuff'),
                    action: 'viewdesignimage',
                    cls: 'a-btn',
                    itemId: 'viewUserStuffBtn',
                    handler: function () {
                        var productInstanceInfo = me.getProductInstanceInfo(productInstanceId, ['photos']);
                        if (Ext.isEmpty(productInstanceInfo?.photos)) {
                            Ext.Msg.alert('提示', '缺失用户素材图')

                        } else {
                            Ext.create('CGP.orderdetails.view.lineitem.Photo', {
                                photos: productInstanceInfo?.photos
                            });
                        }
                    }
                },
                //修改报关分类
                {
                    xtype: 'button',
                    text: i18n.getKey('select') + i18n.getKey('customsCategory'),
                    cls: 'a-btn',
                    hidden: (JSGetQueryString('editable') === 'false') || (!isShowCustomsCategory || !isNeedCustoms),//是否有builder都由报关相关处理
                    itemId: 'customsCategoryBtn',
                    handler: function (btn) {
                        var website = '';
                        //通过接口判断
                        var builderUrl = me.getBuilderUrl(productInstanceId);
                        if (builderUrl) {//有builder
                            me.builderPreview(builderUrl, 'edit', productInstanceId, website, isNeedCustoms,
                                isConfirmCustomsCategory, customsCategoryDTOList, orderLineItemId, orderLineItemStore,
                                isCustomsCategoryCanMultiSelect, customsCategoryId, isShowCustomsCategory);
                        } else {//无builder，触发预览图的点击事件
                            me.diyIimagePreview(imageUrl, isShowCustomsCategory, isNeedCustoms, isCustomsCategoryCanMultiSelect,
                                customsCategoryDTOList, customsCategoryId, orderLineItemId, orderLineItemStore);
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('查看生产预览'),
                    cls: 'a-btn',
                    hidden: isHidePreview,
                    width: '100%',
                    itemId: 'builderPageBtn',
                    handler: function (btn) {
                        const type = 'manufacturePreview',
                            seqNo = record.get('seqNo'),
                            tools = btn.ownerCt,
                            id = record.get('id'),
                            itemGenerateStatus = record.get('itemGenerateStatus'),
                            designMethod = record.get('designMethod'),
                            newDesignMethod = itemGenerateStatus ? 'RANDOM' : designMethod,
                            newValue = newDesignMethod || 'FIX',
                            typeGather = {
                                RANDOM: 'partials/builderrandomcardpage/main.html',
                                FIX: 'partials/builderpage/main.html',
                            },
                            pageUrl = typeGather[newValue],
                            buildPreViewBtn = tools.getComponent('buildPreViewBtn'),
                            url = `${adminPath}api/builder/resource/${type}/url/latest?productInstanceId=${productInstanceId}&language=zh&platform=PC`,
                            manufacturePreview = JSGetQuery(url);

                        if (!Ext.isEmpty(manufacturePreview)) {
                            //记录查看的时间和关闭的数据;通过接口获取到查看指定订单项的builder预览的记录id，关闭时在把该id传回后台，记录查看持续时间
                            var recordUrl = adminPath + `api/orderItems/${id}/manufacturePreview/review/record`;

                            JSAjaxRequest(recordUrl, 'POST', true, null, false, function (require, success, response) {
                                if (success) {
                                    var responseText = Ext.JSON.decode(response.responseText);
                                    if (responseText.success) {
                                        var idCode = responseText.data;

                                        if (itemGenerateStatus && itemGenerateStatus !== 'SUCCESS') {
                                            return JSShowNotification({
                                                type: 'info',
                                                title: '该订单项正在随机中,请随机完成后预览!',
                                            });
                                        }

                                        JSOpen({
                                            id: JSGetUUID(),
                                            url: path + 'partials/builderpage/main.html' +
                                                '?id=' + id +
                                                '&seqNo=' + seqNo +
                                                '&status=' + orderStatusId +
                                                '&orderId=' + orderId +
                                                '&orderNumber=' + orderNumber +
                                                '&productInstanceId=' + productInstanceId +
                                                '&isDeliverInfo=' + isDeliverInfo +
                                                '&manufacturePreview=' + manufacturePreview,
                                            title: i18n.getKey('check by builder'),
                                            target: 'win',
                                            refresh: true,
                                            modal: true,
                                            onclose: function () {
                                                var url2 = adminPath + `api/orderItems/manufacturePreview/review/record/${idCode}`;

                                                JSAjaxRequest(url2, 'PUT', true, null, false, function (require, success, response) {
                                                }, true);
                                            }
                                        });
                                    }
                                }
                            }, true);

                        } else {
                            var msg = Ext.Msg?.diyAlertWin?.msg || '';
                            Ext.Msg.diyAlertWin?.hide();
                            Ext.Msg.confirm(i18n.getKey('prompt'), msg + '<br>是否跳转至用户预览 ?', function (selector) {
                                if (selector === 'yes') {
                                    buildPreViewBtn.handler(buildPreViewBtn);
                                }
                            });
                        }
                    }
                },
                //builder查看历史记录
                {
                    xtype: 'button',
                    record: record,
                    text: '生产预览查看记录',
                    cls: 'a-btn',
                    hidden: isHidePreview,
                    mode: 'changeUserDesign',
                    itemId: 'builderCheckHistoryBtn',
                    handler: function () {
                        var orderLineItemId = record.get('id');
                        me.showBuilderCheckHistory(orderLineItemId);
                    }
                },
                {
                    xtype: 'edit_design_btn',
                    record: record,
                    mode: 'changeUserDesign',
                    itemId: 'changeUserDesignBtn',
                    hidden: !isShowUserDesign
                },

            ],
            listeners: {
                afterrender: function (panel) {
                    // 隐藏配置按钮
                    isShowClickItem && Object.keys(isShowClickItem).forEach(key => {
                        var btn = panel.getComponent(key);
                        console.log(key);
                        btn.setVisible(isShowClickItem[key]);
                    })
                }
            }
        };
        return image;
    },
    /**
     * 根据产品instance获取builder地址
     * @param productInstanceId
     * @returns {string}
     */
    getBuilderUrl: function (productInstanceId) {
        var newUrl = '',
            platform = 'PC',
            token_type = 'bearer',
            type = 'userPreview',
            access_token = Ext.util.Cookies.get('token'),
            url = adminPath + `api/builder/resource/${type}/url/latest?productInstanceId=${productInstanceId}&platform=${platform}`;

        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            var responseText = Ext.JSON.decode(response.responseText);
            if (responseText.success) {
                // 2025.11.25 xiu 给修改用户设计与查看用户设计的iframe地址加一个参数 themes=qpmn
                // 2025.11.26 xiu 需版本>=5时加 themes=qpmn 老版本不兼容
                var data = responseText.data,
                    newAdminPath = adminPath.slice(0, adminPath.length - 10),
                    controller = Ext.create('CGP.orderdetails.view.render.OrderLineItemRender'),
                    isGreaterFiveVersion = controller.getRegularIsGreaterFiveVersion(data),
                    themesParams = isGreaterFiveVersion ? '&themes=qpmn' : '',
                    newParams = `?productInstanceId=${productInstanceId}&access_token=${access_token}&token_type=${token_type}${themesParams}`;

                newUrl = newAdminPath + data + newParams;
                console.log(newUrl);
            }
        });
        return newUrl;
    },

    //product info
    renderProductInfo: function (value, metadata, record) {
        var controller = this,
            orderLineItemStore = record.store,
            model = record.get('productModel'),
            sku = record.get("productSku"),
            designId = record.get("designId"),
            materialName = record.get('materialName'),
            materialId = record.get('materialId'),
            productInstanceId = record.get('productInstanceId'),
            versionedProductAttributeId = record.get('versionedProductAttributeId');

        if (Ext.isEmpty(window.iframeMessageHandle)) {
            JSAddFrameMessageHandle(function (data) {
                controller.updateCustomCategory(orderLineItemStore, data.orderLineItemId, data.customsCategoryId);
            });
        }

        var items = [
            {
                title: i18n.getKey('model'),
                value: model
            },
            {
                title: i18n.getKey('sku'),
                value: sku
            },
            {
                title: i18n.getKey('物料Name'),
                value: materialName
            },
            {
                title: i18n.getKey('物料Id'),
                value: materialId
            },
            {
                title: i18n.getKey('属性版本Id'),
                value: versionedProductAttributeId
            },
            {
                title: i18n.getKey('productInstanceId'),
                value: productInstanceId
            },
            {
                title: i18n.getKey('designId'),
                value: designId
            }
        ];

        return JSCreateHTMLTableV2(items, 'left', 'auto', true);
    },

    setJSOpen: function (params) {
        var {
            orderId,
            shippingDetailsId,
            statusId,
            status,
            orderStatusId,
            orderDeliveryMethod,
            remark,
            manufactureCenter
        } = params;

        JSOpen({
            id: 'sanction',
            url: path + "partials/orderstatusmodify/multipleAddress.html?id=" + orderId +
                '&shippingDetailsId=' + shippingDetailsId +
                '&status=' + status +
                '&statusId=' + statusId +
                '&orderStatusId=' + JSGetQueryString('statusId') +
                '&orderDeliveryMethod=' + orderDeliveryMethod +
                '&manufactureCenter=' + manufactureCenter +
                '&remark=' + remark || '',
            title: '发货详情',
            refresh: true
        });
    },

    cancelOrderItem: function (orderItemId, callback) {
        var mainRenderer = this;

        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('选择取消原因'),
            items: [
                {
                    xtype: 'errorstrickform',
                    itemId: 'form',
                    layout: 'vbox',
                    defaults: {
                        margin: '5 35 5 15',
                        width: 350,
                    },
                    items: [
                        {
                            xtype: 'radiogroup',
                            name: 'cancelOrderItem',
                            itemId: 'cancelOrderItem',
                            vertical: true,
                            allowBlank: false,
                            fieldLabel: i18n.getKey('取消原因'),
                            labelWidth: 120,
                            items: [
                                {
                                    boxLabel: '客户取消',
                                    width: 120,
                                    name: 'statusId',
                                    inputValue: 41,
                                    checked: true
                                },
                                {
                                    boxLabel: '不可生产,取消',
                                    width: 120,
                                    name: 'statusId',
                                    inputValue: 42,
                                }
                            ],
                        },
                        {
                            xtype: 'textarea',
                            name: 'comment',
                            itemId: 'comment',
                            fieldLabel: i18n.getKey('备注'),
                            labelWidth: 120,
                            height: 50,
                            allowBlank: true,
                        },
                    ],
                },
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    text: i18n.getKey('submit'),
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            form = win.getComponent('form'),
                            formValue = form.getValues(),
                            url = adminPath + 'api/orderItems/' + orderItemId + '/status/v2'

                        if (form.isValid()) {
                            JSAsyncEditQuery(url, formValue, true, function (require, success, response) {
                                if (success) {
                                    var responseText = Ext.JSON.decode(response.responseText);
                                    if (responseText.success) {
                                        JSShowNotification({
                                            type: 'success',
                                            title: '订单项取消成功!',
                                            callback: function () {
                                            } // 调用成功回调
                                        })
                                        win.close();
                                        callback && callback()
                                    }
                                }
                            }, true)
                        }
                    }
                }
            },
        }).show();

    },

    createJumpAddressWindow: function (data, params) {
        const mainRenderer = this;

        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            width: 400,
            title: i18n.getKey('选择跳转地址'),
            items: [
                {
                    xtype: 'errorstrickform',
                    itemId: 'form',
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'grid',
                            itemId: 'grid',
                            columns: [
                                {
                                    xtype: 'atagcolumn',
                                    text: i18n.getKey('地址'),
                                    flex: 1,
                                    dataIndex: 'address',
                                    autoWidthComponents: true,
                                    tooltip: '查看_发货详情',
                                    getDisplayName: function (value, metadata, record) {
                                        var str = JSBuildAddressInfo(value);
                                        metadata.tdAttr = 'data-qtip="' + str + '"';
                                        return str + '  <a href="#" style="color: blue">发货详情</a>';
                                    },
                                    clickHandler: function (value, metadata, record, rowIndex, colIndex, store, view) {
                                        var id = record.get('id'),
                                            orderDeliveryMethod = record.get('orderDeliveryMethod');
                                        mainRenderer.setJSOpen(Ext.Object.merge(params, {
                                            shippingDetailsId: id,
                                            orderDeliveryMethod: orderDeliveryMethod,
                                        }))
                                    }
                                },
                            ],
                            store: Ext.create('Ext.data.Store', {
                                autoSync: true,
                                fields: [
                                    {
                                        name: 'id',
                                        type: 'number'
                                    },
                                    {
                                        name: 'address',
                                        type: 'object'
                                    }
                                ],
                                proxy: {
                                    type: 'memory'
                                },
                                data: data
                            })
                        }
                    ]
                },
            ],
        }).show();
    },

    // 选择生产基地窗口
    createSelectProductionBaseWindow: function (data, callBack) {
        var controller = this

        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('修改生产基地'),
            items: [
                {
                    xtype: 'errorstrickform',
                    itemId: 'form',
                    defaults: {
                        margin: '10 25 5 25',
                        allowBank: true
                    },
                    layout: 'vbox',
                    diyGetValue: function () {
                        var me = this,
                            result = {},
                            items = me.items.items;
                        items.forEach(item => {
                            var name = item['name'];
                            result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue()
                        })
                        return result;
                    },
                    diySetValue: function (data) {
                        var me = this,
                            items = me.items.items;
                        items.forEach(item => {
                            var {name} = item;
                            item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name])
                        })
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'id',
                            itemId: 'id',
                            hidden: true,
                            fieldLabel: i18n.getKey('id'),
                        },
                        {
                            xtype: 'combo',
                            fieldLabel: i18n.getKey('生产基地'),
                            name: 'manufactureCenter',
                            itemId: 'manufactureCenter',
                            isLike: false,
                            editable: false,
                            isNumber: true,
                            haveReset: true,
                            displayField: 'key',
                            valueField: 'value',
                            store: {
                                fields: ['key', 'value'],
                                data: [
                                    {
                                        'key': '东莞生产基地',
                                        'value': "PL0001"
                                    },
                                    {
                                        'key': '越南生产基地',
                                        'value': "PL0003"
                                    }
                                ]
                            }
                        }
                    ],
                    listeners: {
                        afterrender: function (comp) {
                            data && comp.diySetValue(data);
                        }
                    }
                },
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            form = win.getComponent('form'),
                            formData = form.diyGetValue(),
                            {id, manufactureCenter} = formData,
                            url = adminPath + `api/orderItems/${id}/manufactureCenter?manufactureCenter=${manufactureCenter}`;

                        if (form.isValid()) {
                            controller.asyncEditQuery(url, null, false, function (require, success, response) {
                                var responseMessage = Ext.JSON.decode(response.responseText);
                                if (responseMessage.success) {
                                    win.close();
                                    callBack && callBack(formData);
                                }
                            })
                        }
                    }
                }
            },
        }).show();
    },

    getManufactureCenterText: function (code) {
        var result = {
                text: '',
                color: '',
                btnBackgroundColor: []
            },
            newCode = code || 'PL0001';
        if (newCode) {
            var manufactureCenterGather = {
                PL0003: {
                    text: '越南',
                    color: 'green',
                    btnBackgroundColor: ['#4caf50', '#43a047', '#388e3c', '#43a047'],
                },
                PL0002: {
                    text: '美国',
                    color: 'orange',
                    btnBackgroundColor: ['#4b9cd7', '#3892d3', '#358ac8', '#3892d3'],
                },
                PL0001: {
                    text: '东莞',
                    color: '#358ac8',
                    btnBackgroundColor: ['#4b9cd7', '#3892d3', '#358ac8', '#3892d3'],
                }
            }

            result = manufactureCenterGather[newCode];
        }
        return result;
    },

    setResetRandomCardLayoutFn: function (orderItemId, callBack) {
        var url = adminPath + `${orderItemId}`,
            result = {}

        JSAsyncEditQuery(url, result, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    callBack && callBack(responseText.data);
                }
            }
        })
    },

    /**
     * 返回orderItem的column列表
     * @returns {Map<any, any>}
     * isDeliverInfo 是否是发货详情页
     */
    getOrderItemCfg: function (orderParams, isDeliverInfo, isShowClickItem) {
        //操作
        var mainRenderer = this,
            {orderId, orderStatusId, remark, grid} = orderParams,
            controller = Ext.create('CGP.order.controller.Order'),
            map = new Map(),
            obj = {
                //seqNo
                0: {
                    text: i18n.getKey('订单项序号'),
                    dataIndex: 'seqNo',
                    align: 'center',
                    sortable: true,
                    width: 110,
                },
                //item info
                /*1: {
                    dataIndex: 'seqNo',
                    width: 230,
                    text: i18n.getKey('orderItemInfo'),
                    renderer: function (value, metadata, record) {
                        var originalValue = mainRenderer.renderItemInfo(value, metadata, record),
                            qty = record.get('qty'),
                            newValue = `数量: ${qty}`

                        return isDeliverInfo ? newValue : originalValue;
                    }
                },*/
                9: {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('订单项状态'),
                    dataIndex: 'seqNo',
                    width: 260,
                    getDisplayName: function (value, metadata, record) {
                        return mainRenderer.renderItemStatus(value, metadata, record);
                    },
                    clickHandler: function (value, metadata, record) {
                        var orderItemId = record.get('_id');

                        controller.setResetRandomCardLayoutFn(orderItemId, function () {

                        })
                    },
                },
                1: {
                    xtype: 'atagcolumn',
                    dataIndex: 'seqNo',
                    width: 180,
                    text: i18n.getKey('订单项信息'),
                    getDisplayName: function (value, metadata, record) {
                        var originalValue = mainRenderer.renderItemInfo(value, metadata, record),
                            qty = record.get('qty'),
                            newValue = `数量: ${qty}`

                        return isDeliverInfo ? newValue : originalValue;
                    },
                    clickHandler: function (value, metadata, record) {
                        var currencyExchangeRates = record.get('currencyExchangeRates');

                        if (currencyExchangeRates.length) {
                            controller.createChangeRateWin(currencyExchangeRates);
                        } else {
                            JSShowNotification({
                                type: 'info',
                                title: '未获取到汇率信息!',
                            })
                        }
                    },
                },
                2: {
                    dataIndex: 'productName',
                    text: i18n.getKey('product') + i18n.getKey('description'),
                    width: 380,
                    xtype: 'atagcolumn',
                    getDisplayName: function (value, metadata, record) {
                        var productDescription = record.get('productDescription');

                        return JSAutoWordWrapStr(JSCreateFont('#000000', true, productDescription || value)) +
                            '\n<a href="#" data-qtip="产品属性" style="color: blue; font-weight: bold">查看产品属性</a>'
                    },
                    clickHandler: function (value, metadata, record) {
                        var orderItemId = record.get('_id'),
                            url = adminPath + `api/orderItems/${orderItemId}/productAttributeValues`;
                        JSAjaxRequest(url, 'GET', true, null, false, function (require, success, response) {
                            if (success) {
                                var responseText = Ext.JSON.decode(response.responseText);
                                if (responseText.success) {
                                    var data = responseText.data;
                                    var store = Ext.create('Ext.data.Store', {
                                        fields: ['attributeName', 'attributeValue'],
                                        data: data
                                    });
                                    var win = Ext.create('Ext.window.Window', {
                                        title: i18n.getKey('查看产品属性'),
                                        modal: true,
                                        constrain: true,
                                        maxHeight: 550,
                                        minHeight: 250,
                                        width: 400,
                                        layout: 'fit',
                                        items: [{
                                            xtype: 'grid',
                                            header: false,
                                            store: store,
                                            columns: [
                                                {
                                                    xtype: 'rownumberer'
                                                },
                                                {
                                                    xtype: "auto_bread_word_column",

                                                    text: i18n.getKey('属性名'),
                                                    dataIndex: 'attributeName',
                                                    flex: 1
                                                },
                                                {
                                                    xtype: "auto_bread_word_column",
                                                    dataIndex: 'attributeValue',
                                                    text: i18n.getKey('值'),
                                                    flex: 2
                                                }
                                            ]
                                        }]
                                    });
                                    win.show(null, function () {
                                        var win = this;
                                        setTimeout(function () {
                                            win.center();
                                        }, 100);
                                    });
                                }
                            }
                        }, true);
                    },
                },
                //product image
                3: {
                    dataIndex: 'productImageUrl',
                    text: i18n.getKey('image'),
                    xtype: 'componentcolumn',
                    width: 140,
                    renderer: function (value, metadata, record) {
                        var thumbnailInfo = record.get('thumbnailInfo'),
                            status = thumbnailInfo?.status,
                            thumbnail = thumbnailInfo?.thumbnail;
                        if (['', undefined].includes(thumbnail) && !['FAILURE', 'RUNNING'].includes(status)) {
                            status = 'NULL'
                        }
                        var statusGather = {
                            SUCCESS: function () {
                                return '查看图片';
                            },
                            FAILURE: function () {
                                return '图片生成失败';
                            },
                            RUNNING: function () {
                                return '图片正在生成中';
                            },
                            INIT: function () {
                                return '查看图片';
                            },
                            NULL: function () {
                                return '图片为空';
                            }
                        }
                        metadata.tdAttr = `data-qtip=${statusGather[status]()}`
                        return mainRenderer.rendererImage(value, metadata, record, isShowClickItem);
                    }
                },
                //product information
                4: {
                    dataIndex: 'productName',
                    text: i18n.getKey('product') + '|' + i18n.getKey('material'),
                    width: 250,
                    flex: isDeliverInfo ? 1 : undefined,
                    renderer: function (value, metadata, record) {
                        return mainRenderer.renderProductInfo(value, metadata, record);
                    }
                },
                5: {
                    xtype: 'componentcolumn',
                    width: 340,
                    dataIndex: 'productAttributeValues',
                    text: i18n.getKey('productAttributeValues'),
                    renderer: function (value, metadata, record) {
                        if (Ext.isEmpty(record.get('productSku'))) {
                            return '';
                        }
                        var arr = []

                        Ext.Array.each(value, function (item) {
                            item.attributeValue && arr.push({
                                display: item.attributeName,
                                value: item.attributeValue
                            })
                        });

                        return {
                            xtype: 'key_value_display_view',
                            rowCount: 6,
                            initData: arr,
                        }
                    }
                },
                6: {
                    dataIndex: 'thirdManufactureName',
                    text: i18n.getKey('相关信息'),
                    width: 230,
                    hidden: isDeliverInfo,
                    renderer: function (value, metaData, record) {
                        var thirdManufactureName = record.get('thirdManufactureName'),
                            manufactureCenter = record.get('manufactureCenter'),
                            finalManufactureCenter = record.get('finalManufactureCenter'),
                            versionedProductAttributeId = record.get('versionedProductAttributeId'),
                            manufactureCenterStyle = mainRenderer.getManufactureCenterText(manufactureCenter),
                            finalManufactureCenterStyle = mainRenderer.getManufactureCenterText(finalManufactureCenter),
                            manufactureColor = manufactureCenterStyle?.color,
                            manufactureText = manufactureCenterStyle?.text,
                            finalManufactureColor = finalManufactureCenterStyle?.color,
                            finalManufactureText = finalManufactureCenterStyle?.text,
                            item = [
                                {
                                    title: '生产基地',
                                    value: JSCreateFont(finalManufactureColor, true, `${finalManufactureText}生产基地`, 15)
                                },
                            ];

                        // 只在73环境以下显示
                        if (!JSWebsiteIsStage()) {
                            item.push(
                                {
                                    title: '预设生产基地',
                                    value: JSCreateFont(manufactureColor, true, `${manufactureText}生产基地`, 15)
                                },
                            )
                        }


                        if (thirdManufactureName) {
                            item.push({
                                title: '是否外派生产',
                                value: '<font color="red">' + i18n.getKey(!Ext.isEmpty(value)) + '</font>'
                            });
                            item.push({
                                title: '生产供应商',
                                value: value
                            });
                        }
                        if (versionedProductAttributeId) {
                            item.push(
                                {
                                    title: '属性版本Id',
                                    value: versionedProductAttributeId
                                },
                            );
                        }
                        return JSCreateHTMLTable(item);
                    }
                },
                7: {
                    dataIndex: 'comment',
                    text: i18n.getKey('comment'),
                    flex: 1,
                    hidden: isDeliverInfo,
                    renderer: function (v, m, r) {
                        m.tdAttr = 'data-qtip="' + v + '"';
                        return JSAutoWordWrapStr(v);
                    }
                },
                8: {
                    xtype: 'componentcolumn',
                    text: i18n.getKey('操作'),
                    dataIndex: '_id',
                    autoWidthComponents: true,
                    width: 120,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                        var orderItemStatusId = record.get('statusId'),
                            isShip = record.get('isShip'),
                            finalManufactureCenter = record.get('finalManufactureCenter'),
                            {text, btnBackgroundColor} = mainRenderer.getManufactureCenterText(finalManufactureCenter),
                            // 取消状态 与 生产后状态不可取消
                            hiddenCancelBtn = [41, 42, 120, 121, 122, 106, 107, 108, 109].includes(orderItemStatusId),
                            hiddenShippingInfoBtn = !!([41, 42].includes(orderItemStatusId) || isDeliverInfo);

                        return {
                            xtype: 'fieldcontainer',
                            layout: 'vbox',
                            defaults: {
                                margin: '5 0 5 0',
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('取消'),
                                    itemId: 'cancel',
                                    tooltip: '取消_订单项',
                                    hidden: hiddenCancelBtn,
                                    handler: function (field) {
                                        var isGather = {
                                            true: function () {
                                                var length = store.data.length;
                                                if (length > 1) {
                                                    mainRenderer.cancelOrderItem(value, function () {
                                                        store.load();
                                                    });
                                                } else {
                                                    Ext.Msg.confirm(i18n.getKey('prompt'), `若取消最后一项，发货详情将关闭，是否继续？`, function (code) {
                                                        if (code === 'yes') {
                                                            mainRenderer.cancelOrderItem(value, function () {
                                                                var tab = top.Ext.getCmp('tabs'),
                                                                    pageId = tab.getActiveTab().id;

                                                                tab.remove(pageId);
                                                            });
                                                        }
                                                    })
                                                }
                                            },
                                            false: function () {
                                                mainRenderer.cancelOrderItem(value, function () {
                                                    store.load();
                                                });
                                            }
                                        }
                                        isGather[hiddenShippingInfoBtn]();
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('发货详情') + `(${text})`,
                                    itemId: 'shipping_details',
                                    tooltip: '查看_发货详情',
                                    hidden: hiddenShippingInfoBtn,
                                    // hidden: true,
                                    style: `background-image: -webkit-gradient(linear,
                  50% 0, 50% 100%, color-stop(0%, ${btnBackgroundColor[0]}), 
                  color-stop(50%, ${btnBackgroundColor[1]}),
                   color-stop(51%, ${btnBackgroundColor[2]}),
                    color-stop(100%, ${btnBackgroundColor[3]}));
                     border-color:${btnBackgroundColor[0]};
                      color: #fff;`,//渐变
                                    handler: function (field) {
                                        var me = this,
                                            url = adminPath + `api/shipmentRequirements/orderLineItemId?orderLineItemId=${value}`,
                                            data = mainRenderer.getQuery(url);

                                        // 返回多条订单要求时 弹出弹窗进行选择
                                        if (data.length > 1) {
                                            var params = {
                                                orderId: orderId,
                                                orderStatusId: orderStatusId,
                                                statusId: orderItemStatusId,
                                                remark: remark,
                                                manufactureCenter: finalManufactureCenter,
                                            };
                                            mainRenderer.createJumpAddressWindow(data, params);
                                        } else if (data.length === 1) {
                                            var newData = data[0],
                                                {orderDeliveryMethod, id} = newData,
                                                params = {
                                                    orderId: orderId,
                                                    shippingDetailsId: id,
                                                    orderStatusId: orderStatusId,
                                                    statusId: orderItemStatusId,
                                                    remark: remark,
                                                    manufactureCenter: finalManufactureCenter,
                                                    orderDeliveryMethod: orderDeliveryMethod,
                                                };
                                            mainRenderer.setJSOpen(params);
                                        } else {
                                            JSShowNotification({
                                                type: 'info',
                                                title: '未查询到发货信息!',
                                            })
                                        }
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('修改生产基地'),
                                    itemId: 'edit_production_base',
                                    tooltip: '修改_生产基地',
                                    // hidden: isShip,
                                    hidden: true,
                                    handler: function (btn) {
                                        var deliverGrid = grid?.getDeliverItemGrid(grid),
                                            data = {
                                                id: value,
                                                manufactureCenter: finalManufactureCenter
                                            }

                                        mainRenderer.createSelectProductionBaseWindow(data, function () {
                                            store.load();
                                            deliverGrid?.store?.load();
                                        })

                                    }
                                },
                            ]
                        };
                    }
                },
            };

        Object.keys(obj).forEach(function (key) {
            map.set(key, obj[key]);
        });
        return map;
    },

    setLockStatus: function (id, isLock, store) {
        var url = adminPath + `api/orderItems/${id}/lock?isLock=${isLock}`,
            isLockText = isLock ? '锁定' : '解锁'

        JSAsyncEditQuery(url, {}, true, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    store.load();
                }
            }
        }, isLockText + '成功')
    },

    /**
     * 返回orderItem的column列表
     * @returns {Map<any, any>}
     * pageType 记录所在页面类型
     * // deliverInfo(发货详情页) || orderStatusModify(生产详细页) ||
     *    orderItemsMultipleAddress(订单详情页) || auditOrderItem 订单项审核页 ||
     *    orderItemPage 订单项页面 || shipmentsItemTailAfterPage 发货细项追踪页
     */
    // 订单项管理页 与 订单详情的订单项列表 共用样式
    getOrderItemCfgV2: function (orderParams, pageType, isShowClickItem) {
        var mainRenderer = this,
            {remark, grid} = orderParams,
            isDeliverInfo = pageType === 'deliverInfo',  //是否是发货详情页
            isOrderStatusModify = pageType === 'orderStatusModify', //是否是生产详细页
            isAuditOrderItem = pageType === 'auditOrderItem', //是否是订单项审核页
            isAuditContentGridPage = pageType === 'auditContentGridPage', //是否是内容审核页
            isAuditOrderItemAndOrderStatusModify = isAuditOrderItem || isOrderStatusModify,//是否是 生产详细页 或者 订单项审核页
            controller = Ext.create('CGP.order.controller.Order'),
            orderLineItemController = Ext.create('CGP.orderlineitem.controller.OrderLineItem'),
            map = new Map(),
            obj = {
                //seqNo
                0: { // 订单项序号
                    text: i18n.getKey('订单项序号'),
                    dataIndex: 'seqNo',
                    align: 'center',
                    sortable: true,
                    width: 110,
                },
                1: { // 所属订单号
                    dataIndex: 'orderNumber',
                    width: 140,
                    text: i18n.getKey('订单号'),
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        var orderNumber = record.get('orderNumber'),
                            orderId = record.get('orderId'),
                            seqNo = record.get('seqNo'),
                            orderLineItemUploadStatus = record.get('orderLineItemUploadStatus'),
                            isRedo = record.get('isRedo'),
                            template = '<a style="text-decoration: none;" href="javascript:{handler}">' + value + '</a>',
                            orderStatus = record.get('orderStatusId');

                        if (isRedo) {
                            template += '<' + '<text style="color: red">' + i18n.getKey('re-produce') + '</text>' + '>';
                        }
                        if (!Ext.isEmpty(orderLineItemUploadStatus) && Ext.Array.contains([300, 301], orderStatus.id)) {
                            template += '<' + '<text style="color: red">' + '上传设计文档状态：' + i18n.getKey(orderLineItemUploadStatus) + '</text>' + '>';
                        }

                        if (seqNo == 1) {
                            metadata.tdAttr = 'data-qtip="' + i18n.getKey('orderDetails') + '"';
                            return new Ext.Template(template).apply({
                                handler: 'showOrderDetail(' + orderId + ',' + '\'' + orderNumber + '\'' + ')'
                            });
                        } else {
                            return '';
                        }
                    }
                },
                2: { // 订单项信息
                    xtype: 'atagcolumn',
                    text: i18n.getKey('订单项状态'),
                    dataIndex: 'seqNo',
                    width: 260,
                    sortable: false,
                    getDisplayName: function (value, metadata, record) {
                        return mainRenderer.renderItemStatus(value, metadata, record);
                    },
                    clickHandler: function (value, metadata, record) {
                        var orderItemId = record.get('_id');

                        controller.setResetRandomCardLayoutFn(orderItemId, function () {

                        })
                    },
                },
                3: { // 便携操作
                    xtype: 'componentcolumn',
                    text: i18n.getKey('操作'),
                    dataIndex: '_id',
                    width: 120,
                    sortable: false,
                    autoWidthComponents: true,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                        var orderItemStatusId = record.get('statusId'),
                            isShip = record.get('isShip'),
                            orderStatusId = record.get('orderStatusId'),
                            customsCategoryId = record.get('customsCategoryId'),
                            isCustomsClearance = record.get('isCustomsClearance'),
                            customsCategoryDTOList = record.get('customsCategoryDTOList'),
                            finalManufactureCenter = record.get('finalManufactureCenter'),
                            {text, btnBackgroundColor} = mainRenderer.getManufactureCenterText(finalManufactureCenter),
                            // 取消状态 与 生产后状态不可取消
                            hiddenCancelBtn = [41, 42, 120, 121, 122, 106, 107, 108, 109].includes(orderItemStatusId),
                            hiddenShippingInfoBtn = !!([41, 42].includes(orderItemStatusId) || isDeliverInfo) || isAuditOrderItem, //审核页不显示发货详情按钮
                            isNeedCustomsCategory = isCustomsClearance, //是否需报关分量
                            isOrderItemPage = pageType === 'orderItemPage',
                            isAuditPending = [110, 101].includes(+orderItemStatusId); //待审核状态

                        return {
                            xtype: 'fieldcontainer',
                            layout: 'vbox',
                            defaults: {
                                margin: '5 0 5 0',
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('取消'),
                                    itemId: 'cancel',
                                    tooltip: '取消_订单项',
                                    hidden: hiddenCancelBtn,
                                    handler: function (field) {
                                        var isGather = {
                                            true: function () {
                                                var length = store.data.length;
                                                if (length > 1) {
                                                    mainRenderer.cancelOrderItem(value, function () {
                                                        store.load();
                                                    });
                                                } else {
                                                    Ext.Msg.confirm(i18n.getKey('prompt'), `若取消最后一项，发货详情将关闭，是否继续？`, function (code) {
                                                        if (code === 'yes') {
                                                            mainRenderer.cancelOrderItem(value, function () {
                                                                var tab = top.Ext.getCmp('tabs'),
                                                                    pageId = tab.getActiveTab().id;

                                                                tab.remove(pageId);
                                                            });
                                                        }
                                                    })
                                                }
                                            },
                                            false: function () {
                                                mainRenderer.cancelOrderItem(value, function () {
                                                    store.load();
                                                });
                                            }
                                        }
                                        isGather[hiddenShippingInfoBtn]();
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('发货详情') + `(${text})`,
                                    itemId: 'shipping_details',
                                    tooltip: '查看_发货详情',
                                    hidden: hiddenShippingInfoBtn,
                                    // hidden: true,
                                    style: `background-image: -webkit-gradient(linear,
                  50% 0, 50% 100%, color-stop(0%, ${btnBackgroundColor[0]}), 
                  color-stop(50%, ${btnBackgroundColor[1]}),
                   color-stop(51%, ${btnBackgroundColor[2]}),
                    color-stop(100%, ${btnBackgroundColor[3]}));
                     border-color:${btnBackgroundColor[0]};
                      color: #fff;`,//渐变
                                    handler: function (field) {
                                        var me = this,
                                            orderId = record.get('orderId'),
                                            url = adminPath + `api/shipmentRequirements/orderLineItemId?orderLineItemId=${value}`,
                                            data = mainRenderer.getQuery(url);

                                        // 返回多条订单要求时 弹出弹窗进行选择
                                        if (data.length > 1) {
                                            var params = {
                                                orderId: orderId,
                                                orderStatusId: orderStatusId,
                                                statusId: orderItemStatusId,
                                                remark: remark,
                                                manufactureCenter: finalManufactureCenter,
                                            };
                                            mainRenderer.createJumpAddressWindow(data, params);
                                        } else if (data.length === 1) {
                                            var newData = data[0],
                                                {orderDeliveryMethod, id} = newData,
                                                params = {
                                                    orderId: orderId,
                                                    shippingDetailsId: id,
                                                    orderStatusId: orderStatusId,
                                                    statusId: orderItemStatusId,
                                                    remark: remark,
                                                    manufactureCenter: finalManufactureCenter,
                                                    orderDeliveryMethod: orderDeliveryMethod,
                                                };
                                            mainRenderer.setJSOpen(params);
                                        } else {
                                            JSShowNotification({
                                                type: 'info',
                                                title: '未查询到发货信息!',
                                            })
                                        }
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('修改生产基地'),
                                    itemId: 'edit_production_base',
                                    tooltip: '修改_生产基地',
                                    // hidden: isShip,
                                    hidden: true,
                                    handler: function (btn) {
                                        var deliverGrid = grid?.getDeliverItemGrid(grid),
                                            data = {
                                                id: value,
                                                manufactureCenter: finalManufactureCenter
                                            }

                                        mainRenderer.createSelectProductionBaseWindow(data, function () {
                                            store.load();
                                            deliverGrid?.store?.load();
                                        })

                                    }
                                },
                                {
                                    xtype: 'atag_displayfield',
                                    itemId: 'audit',
                                    value: '审批订单项',
                                    tooltip: `审批订单项`,
                                    hidden: isOrderItemPage || !isAuditPending, //在待审核状态
                                    auditQuery: function () {
                                        mainRenderer.createOrderItemAuditFormWindow(null, function (win, data) {
                                            var url = adminPath + `api/orderItems/${value}/audit`;

                                            JSAsyncEditQuery(url, data, true, function (require, success, response) {
                                                if (success) {
                                                    var responseText = Ext.JSON.decode(response.responseText),
                                                        data = responseText?.data;

                                                    if (responseText.success) {
                                                        store.load();
                                                        win.close();
                                                        JSShowNotification({
                                                            type: 'success',
                                                            title: '订单项审核完成!',
                                                        })
                                                    } else {
                                                        var errorCode = data?.code,
                                                            errorParams = data?.errorParams,
                                                            orderItemIds = errorParams?.orderItemIds,
                                                            codeGather = {
                                                                108000358: '订单项随机状态未完成!',
                                                                108000359: `审核前需完成报关分类!`,
                                                                108000360: '关联的订单未完成后续数据处理!'
                                                            }

                                                        if ([108000358, 108000359, 108000360].includes(errorCode)) {
                                                            Ext.Msg.alert('提示', codeGather[errorCode]);
                                                        }
                                                    }
                                                }
                                            }, true)
                                        });
                                    },
                                    clickHandler: function (field) {
                                        if (isNeedCustomsCategory) { //需报关

                                            if (customsCategoryId) { // 已报关才能审核
                                                field.auditQuery();
                                            } else {
                                                JSShowNotification({
                                                    type: 'info',
                                                    title: '请完善报关分类!',
                                                });
                                            }

                                        } else {  //不用报关的可直接审核
                                            field.auditQuery();
                                        }
                                    }
                                },
                            ]
                        };
                    }
                },
                4: { // 操作栏
                    xtype: 'componentcolumn',
                    text: i18n.getKey('操作栏'),
                    width: 100,
                    sortable: false,
                    autoSizeColumn: false,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                        var statusId = record.get('statusId'),
                            isLock = record.get('isLock'),
                            deliveryOrderShow = [120, 121, 122, 106, 107, 108, 109].includes(statusId),
                            shipmentRequirementShow = [40, 100, 101, 300, 116, 44, 113, 118, 42, 37681428, 9358697].includes(statusId);

                        return {
                            xtype: 'button',
                            ui: 'default-toolbar-small',
                            height: 26,
                            text: i18n.getKey('options'),
                            width: '100%',
                            flex: 1,
                            menu: [
                                {
                                    text: i18n.getKey('modifyStatus'),
                                    disabledCls: 'menu-item-display-none',
                                    handler: function () {
                                        var orderId = record.get('orderId'),
                                            orderLineItemId = record.get('id'),
                                            statusName = record.get('statusName'),
                                            isRedo = record.get('isRedo');

                                        orderLineItemController.modifyOrderLineItemStatus(orderId, orderLineItemId, statusName, isRedo, statusId);
                                    }
                                },
                                {
                                    text: i18n.getKey('check') + i18n.getKey('orderLineItem') + i18n.getKey('product'),
                                    disabledCls: 'menu-item-display-none',
                                    handler: function () {
                                        var productId = record.get('productId');
                                        orderLineItemController.checkProduct(productId);
                                    }
                                },
                                {
                                    text: i18n.getKey('check') + i18n.getKey('orderLineItem') + i18n.getKey('material'),
                                    disabledCls: 'menu-item-display-none',
                                    handler: function () {
                                        var materialId = record.get('materialId');
                                        orderLineItemController.checkMaterial(materialId)
                                    }
                                },
                                {
                                    text: i18n.getKey('check') + i18n.getKey('order'),
                                    disabledCls: 'menu-item-display-none',
                                    handler: function () {
                                        var orderNumber = record.get('orderNumber');
                                        JSOpen({
                                            id: 'page',
                                            url: path + "partials/order/order.html?orderNumber=" + orderNumber,
                                            title: '订单 所有订单',
                                            refresh: true
                                        });
                                    }
                                },
                                /*     {
                                         text: i18n.getKey('check') + i18n.getKey('finishedProductItem'),
                                         disabledCls: 'menu-item-display-none',
                                         hidden: !(Ext.Array.contains([103, 104, 105, 106, 400, 401, 402], (record.get('statusId')))),
                                         handler: function () {
                                             var orderLineItemId = record.getId();
                                             JSOpen({
                                                 id: 'finishedproductitempage',
                                                 url: path + "partials/finishedproductitem/finishedproductitem.html" +
                                                     "?excludeStatusIds=241635&orderLineItemId=" + orderLineItemId,
                                                 title: '成品项管理 生产中',
                                                 refresh: true
                                             });
                                         }
                                     },*/
                                {
                                    text: i18n.getKey('重新上传设计文档'),
                                    disabledCls: 'menu-item-display-none',
                                    hidden: !(!Ext.isEmpty(record.get('orderLineItemUploadStatus')) && Ext.Array.contains([300, 301], statusId)),
                                    handler: function () {
                                        var orderLineItemId = record.getId();
                                        var productInstanceId = record.get('productInstanceId');
                                        var orderId = record.get('orderId');
                                        var orderInfo = controller.getOrder(orderId);
                                        var order = orderInfo;
                                        Ext.Ajax.request({
                                            url: adminPath + 'api/builder/resource/builder/url/latest' +
                                                '?productInstanceId=' + productInstanceId + '&platform=PC&language=en',
                                            method: 'GET',
                                            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                                            success: function (rep) {
                                                var response = Ext.JSON.decode(rep.responseText);
                                                if (response.success) {
                                                    if (Ext.isEmpty(response.data)) {
                                                        Ext.Msg.alert('提示', '产品无配置的builder地址。')
                                                    } else {
                                                        Ext.create('CGP.orderlineitem.view.manualuploaddoc.EditProductInstanceWindow', {
                                                            orderLineItemId: orderLineItemId,
                                                            productInstanceId: productInstanceId,
                                                            builderUrl: response.data,
                                                            order: order
                                                        }).show();
                                                    }
                                                } else {
                                                    Ext.Msg.alert('提示', '请求失败！' + response.data.message);
                                                }
                                            },
                                            failure: function (resp) {
                                                var response = Ext.JSON.decode(resp.responseText);
                                                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                            }
                                        });
                                    }
                                },
                                {
                                    text: i18n.getKey('PC对比工具'),
                                    disabledCls: 'menu-item-display-none',
                                    menu: {
                                        items: [
                                            {
                                                text: i18n.getKey('定制图片对比'),
                                                disabledCls: 'menu-item-display-none',
                                                handler: function () {
                                                    var orderLineItemId = record.getId();
                                                    var productInstanceId = record.get('productId');
                                                    var orderId = record.get('orderId');
                                                    JSOpen({
                                                        id: 'pcCompareBuilder',
                                                        url: path + "partials/test/pcCompare/main.html" +
                                                            "?productInstanceId=" + productInstanceId +
                                                            "&orderLineItemId=" + orderLineItemId +
                                                            '&compareType=cacheImageCompare' +
                                                            '&orderId=' + orderId +
                                                            '&orderItemId=' + orderLineItemId,
                                                        title: 'PC对比builder',
                                                        refresh: true
                                                    });
                                                }
                                            }, {
                                                text: i18n.getKey('排版page对比'),
                                                disabledCls: 'menu-item-display-none',
                                                hidden: !(Ext.Array.contains([103, 104, 105, 106, 400, 401, 402], (record.get('statusId')))),
                                                handler: function () {
                                                    var orderLineItemId = record.getId();
                                                    var productInstanceId = record.get('productId');
                                                    var orderId = record.get('orderId');
                                                    var impressionVersion = record.get('impressionVersion');//
                                                    JSOpen({
                                                        id: 'pcCompareBuilder',
                                                        url: path + "partials/test/pcCompare/main.html?" +
                                                            "productInstanceId=" + productInstanceId +
                                                            "&orderLineItemId=" + orderLineItemId +
                                                            '&compareType=pageCompare&orderId=' + orderId +
                                                            '&orderItemId=' + orderLineItemId +
                                                            '&impressionVersion=' + impressionVersion,
                                                        title: 'PC对比builder',
                                                        refresh: true
                                                    });
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    text: i18n.getKey('check') + i18n.getKey('jobTask') + i18n.getKey('distribute'),
                                    disabledCls: 'menu-item-display-none',
                                    handler: function () {
                                        var orderLineItemId = record.getId();
                                        JSOpen({
                                            id: 'orderItemJobTask',
                                            url: path + "partials/orderlineitem/orderlineitemjobtask.html" +
                                                "?orderLineItemId=" + orderLineItemId,
                                            title: i18n.getKey('orderLineItem') + i18n.getKey('jobTask') + i18n.getKey('distribute'),
                                            refresh: true
                                        });
                                    }
                                },
                                {
                                    text: i18n.getKey('check') + i18n.getKey('shipmentRequirement'),
                                    disabledCls: 'menu-item-display-none',
                                    hidden: !shipmentRequirementShow,
                                    handler: function () {
                                        JSOpen({
                                            id: 'shipmentrequirementpage',
                                            url: path + 'partials/shipmentrequirement/main.html' +
                                                '?oderLineItemId=' + record.get('id'),
                                            title: i18n.getKey('shipmentRequirement'),
                                            refresh: true
                                        })
                                    }
                                },
                                //查看发货订单
                                {
                                    text: i18n.getKey('check') + i18n.getKey('deliveryOrder'),
                                    disabledCls: 'menu-item-display-none',
                                    hidden: !deliveryOrderShow,
                                    handler: function () {
                                        JSOpen({
                                            id: 'deliveryorderpage',
                                            url: path + 'partials/deliveryorder/main.html' +
                                                '?oderLineItemId=' + record.get('id'),
                                            title: i18n.getKey('deliveryOrder'),
                                            refresh: true
                                        })
                                    }
                                },
                                // 锁定
                                {
                                    text: i18n.getKey('锁定'),
                                    hidden: isLock,
                                    handler: function (btn) {
                                        var id = record.get('id');
                                        mainRenderer.setLockStatus(id, true, store);
                                    }
                                },
                                {
                                    text: i18n.getKey('解锁'),
                                    hidden: !isLock,
                                    handler: function (btn) {
                                        var id = record.get('id');
                                        mainRenderer.setLockStatus(id, false, store);
                                    }
                                }
                            ]
                        }
                    }
                },
                5: { // 产品描述
                    xtype: 'atagcolumn',
                    dataIndex: 'productName',
                    text: i18n.getKey('产品描述'),
                    width: 380,
                    sortable: false,
                    getDisplayName: function (value, metadata, record) {
                        var productDescription = record.get('productDescription');

                        return JSAutoWordWrapStr(JSCreateFont('#000000', true, productDescription || value)) +
                            '\n<a href="#" data-qtip="产品属性" style="color: blue; font-weight: bold">查看产品属性</a>'
                    },
                    clickHandler: function (value, metadata, record) {
                        var orderItemId = record.get('_id'),
                            url = adminPath + `api/orderItems/${orderItemId}/productAttributeValues`;
                        JSAjaxRequest(url, 'GET', true, null, false, function (require, success, response) {
                            if (success) {
                                var responseText = Ext.JSON.decode(response.responseText);
                                if (responseText.success) {
                                    var data = responseText.data;
                                    var store = Ext.create('Ext.data.Store', {
                                        fields: ['attributeName', 'attributeValue'],
                                        data: data
                                    });
                                    var win = Ext.create('Ext.window.Window', {
                                        title: i18n.getKey('查看产品属性'),
                                        modal: true,
                                        constrain: true,
                                        maxHeight: 550,
                                        minHeight: 250,
                                        width: 400,
                                        layout: 'fit',
                                        items: [{
                                            xtype: 'grid',
                                            header: false,
                                            store: store,
                                            columns: [
                                                {
                                                    xtype: 'rownumberer'
                                                },
                                                {
                                                    xtype: "auto_bread_word_column",

                                                    text: i18n.getKey('属性名'),
                                                    dataIndex: 'attributeName',
                                                    flex: 1
                                                },
                                                {
                                                    xtype: "auto_bread_word_column",
                                                    dataIndex: 'attributeValue',
                                                    text: i18n.getKey('值'),
                                                    flex: 2
                                                }
                                            ]
                                        }]
                                    });
                                    win.show(null, function () {
                                        var win = this;
                                        setTimeout(function () {
                                            win.center();
                                        }, 100);
                                    });
                                }
                            }
                        }, true);
                    },
                },
                6: { // 订单项信息
                    xtype: 'atagcolumn',
                    dataIndex: 'seqNo',
                    width: 180,
                    text: i18n.getKey('订单项信息'),
                    sortable: false,
                    getDisplayName: function (value, metadata, record) {
                        var originalValue = mainRenderer.renderItemInfo(value, metadata, record),
                            qty = record.get('qty'),
                            newValue = `数量: ${qty}`

                        return isDeliverInfo ? newValue : originalValue;
                    },
                    clickHandler: function (value, metadata, record) {
                        var currencyExchangeRates = record.get('currencyExchangeRates');

                        if (currencyExchangeRates.length) {
                            controller.createChangeRateWin(currencyExchangeRates);
                        } else {
                            JSShowNotification({
                                type: 'info',
                                title: '未获取到汇率信息!',
                            })
                        }
                    },
                },
                7: { //图片
                    xtype: 'componentcolumn',
                    dataIndex: 'productImageUrl',
                    text: i18n.getKey('图片'),
                    width: 140,
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        var thumbnailInfo = record.get('thumbnailInfo'),
                            status = thumbnailInfo?.status,
                            thumbnail = thumbnailInfo?.thumbnail;
                        if (['', undefined].includes(thumbnail) && !['FAILURE', 'RUNNING'].includes(status)) {
                            status = 'NULL'
                        }
                        var statusGather = {
                            SUCCESS: function () {
                                return '查看图片';
                            },
                            FAILURE: function () {
                                return '图片生成失败';
                            },
                            RUNNING: function () {
                                return '图片正在生成中';
                            },
                            INIT: function () {
                                return '查看图片';
                            },
                            NULL: function () {
                                return '图片为空';
                            }
                        }
                        metadata.tdAttr = `data-qtip=${statusGather[status]()}`
                        return mainRenderer.rendererImage(value, metadata, record, isShowClickItem);
                    }
                },
                8: { // 产品|物料
                    dataIndex: 'productName',
                    text: i18n.getKey('产品 | 物料'),
                    width: 400,
                    sortable: false,
                    flex: isDeliverInfo ? 1 : undefined,
                    renderer: function (value, metadata, record) {
                        return mainRenderer.renderProductInfo(value, metadata, record);
                    }
                },
                9: { // 是否测试单
                    text: i18n.getKey('是否测试单'),
                    dataIndex: 'isTest',
                    itemId: 'isTest',
                    width: 90,
                    sortable: false,
                    renderer: function (value, metadata) {
                        var isTest = value;
                        return JSCreateFont(isTest ? 'green' : 'red', true, i18n.getKey(isTest));
                    }
                },
                10: { //相关信息
                    dataIndex: 'thirdManufactureName',
                    text: i18n.getKey('相关信息'),
                    width: 230,
                    sortable: false,
                    hidden: isDeliverInfo,
                    renderer: function (value, metaData, record) {
                        var thirdManufactureName = record.get('thirdManufactureName'),
                            manufactureCenter = record.get('manufactureCenter'),
                            finalManufactureCenter = record.get('finalManufactureCenter'),
                            manufactureCenterStyle = mainRenderer.getManufactureCenterText(manufactureCenter),
                            finalManufactureCenterStyle = mainRenderer.getManufactureCenterText(finalManufactureCenter),
                            manufactureColor = manufactureCenterStyle?.color,
                            manufactureText = manufactureCenterStyle?.text,
                            finalManufactureColor = finalManufactureCenterStyle?.color,
                            finalManufactureText = finalManufactureCenterStyle?.text,
                            item = [
                                {
                                    title: '生产基地',
                                    value: JSCreateFont(finalManufactureColor, true, `${finalManufactureText}生产基地`, 15)
                                },
                            ];

                        // 只在73环境以下显示
                        if (!JSWebsiteIsStage()) {
                            item.push(
                                {
                                    title: '预设生产基地',
                                    value: JSCreateFont(manufactureColor, true, `${manufactureText}生产基地`, 15)
                                },
                            )
                        }


                        if (thirdManufactureName) {
                            item.push({
                                title: '是否外派生产',
                                value: '<font color="red">' + i18n.getKey(!Ext.isEmpty(value)) + '</font>'
                            });
                            item.push({
                                title: '生产供应商',
                                value: value
                            });
                        }

                        return JSCreateHTMLTable(item);
                    }
                },
                11: {
                    xtype: 'componentcolumn',
                    text: i18n.getKey('店铺产品信息'),
                    dataIndex: 'id',
                    width: 280,
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        if (value) {
                            var bindSeqNo = record.get('bindSeqNo'),
                                bindOrderNumber = record.get('bindOrderNumber'),
                                storeName = record.get('storeName'),
                                storeProductId = record.get('storeProductId'),
                                allowDesign = record.get('allowDesign'),
                                designMethod = record.get('designMethod'),
                                designId = record.get('designId'),　//设计id
                                isCustomsClearance = record.get('isCustomsClearance'), //是否需要报关
                                customsCategoryDTOList = record.get('customsCategoryDTOList'),//可选的报关分类列表
                                customsCategoryId = record.get('customsCategoryId'),//已经选定报关分类
                                //由于designMethod不能直接判断是否为随机固定 从而通过该字段是否存在判断是否为随机完成
                                itemGenerateStatus = record.get('itemGenerateStatus'),
                                isFinishedProduct = record.get('isFinishedProduct'), //是否是成品单
                                newDesignMethod = itemGenerateStatus ? 'RANDOM' : designMethod,
                                productTypeGather = {
                                    FIX: {
                                        designMethodText: i18n.getKey('固定定制'),
                                        isAudited: record.get('fixDesignReview'),//固定设计内容是否审核
                                    },
                                    RANDOM: {
                                        designMethodText: i18n.getKey('随机定制'),
                                        isAudited: record.get('randomDesignReview'),//随机卡图库是否审核
                                    },
                                },
                                customsCategory = customsCategoryDTOList?.find(function (listItem) {
                                    return listItem._id === customsCategoryId;
                                }),
                                customsCategoryOutName = customsCategoryId ? customsCategory.outName : '未分类',
                                customsCategoryText = isCustomsClearance ? customsCategoryOutName : '无需报关',
                                allowDesignText = allowDesign ? 'C端允许修改' : 'C端不可修改',
                                isShowAllowDesignText = !!storeProductId, //没有店铺产品就不显示allowDesignText
                                {designMethodText, isAudited} = productTypeGather[newDesignMethod || 'FIX'],
                                isAuditedText = JSCreateFont('red', true, (isAudited ? '已审核' : '未审核')),
                                finishedText = JSCreateFont('green', true, '无需审核(成品单)'),
                                auditedText = isFinishedProduct ? finishedText : isAuditedText,
                                isHiddenAllowDesignText = !isShowAllowDesignText || isAuditContentGridPage,
                                infoGather = [
                                    {
                                        title: JSCreateFont('red', true, '定制类型'),
                                        value: JSCreateFont('red', true, designMethodText),
                                    },
                                    {
                                        title: JSCreateFont('red', true, '内容审核'),
                                        // hidden: true, //先提交部分　
                                        // hideLabelSeparator: true,
                                        value: auditedText,
                                    },
                                    {
                                        title: '店铺名称',
                                        value: storeName,
                                    },
                                    {
                                        title: '店铺产品Id',
                                        value: storeProductId,
                                    },
                                    {
                                        title: 'C端是否可定制',
                                        hidden: isHiddenAllowDesignText,　
                                        value: allowDesignText,
                                    },
                                    {
                                        title: '店铺订单号',
                                        value: bindOrderNumber ? `${bindOrderNumber}-${bindSeqNo}` : '',
                                    },
                                    /*{　
                                        title: '店铺产品设计版本',
                                        value: '版本1',
                                        labelWidth: 120,
                                    },*/
                                    //需报关
                                    {
                                        title: '报关分类',
                                        value: customsCategoryText,
                                        hidden: !isCustomsClearance || isAuditContentGridPage,
                                        // labelWidth: 90,
                                    },
                                    //无需报关
                                    {
                                        title: customsCategoryText,
                                        hidden: isCustomsClearance || isAuditContentGridPage,
                                        hideLabelSeparator: true,
                                        value: '',
                                    }
                                ]

                            return {
                                xtype: 'container',
                                width: '100%',
                                layout: 'vbox',
                                defaults: {
                                    width: '100%',
                                    margin: '5 0 5 20',
                                    labelAlign: 'left',
                                },
                                items: [],
                                diySetValue: function (data) {
                                    var me = this;

                                    data.forEach(item => {
                                        var {title, value, labelWidth, hideLabelSeparator, hidden} = item,
                                            labelSeparatorText = hideLabelSeparator ? '' : ':',
                                            defaultLabelWidth = isHiddenAllowDesignText ? 80 : 100

                                        if (hideLabelSeparator || value) {
                                            me.add({
                                                xtype: 'displayfield',
                                                labelSeparator: labelSeparatorText, //不使用冒号
                                                labelWidth: labelWidth || defaultLabelWidth,
                                                fieldLabel: title,
                                                hidden: !!hidden,
                                                value: value,
                                            })
                                        }
                                    })
                                },
                                listeners: {
                                    afterrender: function (me) {
                                        me.diySetValue(infoGather);
                                    }
                                }
                            };
                        }
                    }
                },
                12: { //备注
                    dataIndex: 'comment',
                    text: i18n.getKey('备注'),
                    width: 230,
                    sortable: false,
                    hidden: isDeliverInfo,
                    renderer: function (v, m, r) {
                        m.tdAttr = 'data-qtip="' + v + '"';
                        return JSAutoWordWrapStr(v);
                    }
                },
            };

        Object.keys(obj).forEach(function (key) {
            map.set(key, obj[key]);
        });
        return map;
    },

    getProductInstanceInfo: function (productInstanceId, arr) {
        var controller = this, result = {},
            url = adminPath + `api/productInstances/${productInstanceId}/fieldProject?fieldProject=${Ext.JSON.encode(arr)}`;
        JSAjaxRequest(url, 'GET', false, false, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    result = responseText.data;
                }
            }
        });
        return result;
    },
    /**
     * 更新报分类信息
     */
    updateCustomCategory: function (orderLineItemStore, orderLineItemId, customsCategoryId) {
        //当前页是否已经显示，如果已经显示，就直接修改，不然等页面显示后再修改
        var activeTab = top.Ext.getCmp('tabs').getActiveTab(), currentTab = null;
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

    /**
     *
     * @param builderUrl
     * @param action
     * @param productInstanceId
     * @param website
     * @param isNeedCustoms 是否需要报关
     * @param isConfirmCustomsCategory 是否已确定报关分类
     * @param productId
     * @param orderLineItemId 订单项id
     * @param orderLineItemStore 订单项store
     * @param isCustomsCategoryCanMultiSelect 是否有多个报关分类可供选择
     * @param customsProductInfoId 报关分类id
     * @param isShowCustomsCategory 是否需要显示报关分类相关业务
     */
    builderPreview: function (builderUrl, action, productInstanceId, website, isNeedCustoms,
                              isConfirmCustomsCategory, customsCategoryDTOList, orderLineItemId,
                              orderLineItemStore, isCustomsCategoryCanMultiSelect, customsProductInfoId, isShowCustomsCategory) {
        var websiteUrl = '',
            html,
            src = '';

        src = new Ext.Template(builderUrl).apply({
            productInstanceId: productInstanceId,
            token: Ext.util.Cookies.get('token'),
            locale: Ext.util.Cookies.get('lang'),
            website: websiteUrl,
            action: action,
            productId: false
        });

        if (src.indexOf('isPreview=') == -1) {
            if (src.indexOf('?') == -1) {
                src += '?isPreview=' + true;
            } else {
                src += '&isPreview=' + true;
            }
        }
        if (src.indexOf('access_token=') == -1) {
            if (src.indexOf('?') == -1) {
                src += '?access_token=' + Ext.util.Cookies.get('token') + '&token_type=bearer';
            } else {
                src += '&access_token=' + Ext.util.Cookies.get('token') + '&token_type=bearer';
            }
        }
        if (src.indexOf('productInstanceId=') == -1) {
            if (src.indexOf('?') == -1) {
                src += '?productInstanceId=' + productInstanceId;
            } else {
                src += '&productInstanceId=' + productInstanceId;
            }
        }

        html = '<iframe style="border:none;" src="' + src + '" width="100%" height="100%"></iframe>';

        var window = new Ext.window.Window({
            constrain: true,
            modal: true,
            width: 700,
            height: 700,
            maximizable: true,
            title: i18n.getKey('edit'),
            layout: 'border',
            maximized: true,
            items: [],
            bbar: {
                hidden: !(isShowCustomsCategory && isNeedCustoms && isCustomsCategoryCanMultiSelect),//是否需要显示报关相关业务，需要报关，且有多个报关分类可供选择时显示
                items: [
                    {
                        xtype: 'combo',
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                {
                                    name: '_id',
                                    type: 'string'
                                },
                                {
                                    name: 'outName',
                                    type: 'string'
                                }
                            ],
                            data: customsCategoryDTOList
                        }),
                        valueField: '_id',
                        itemId: 'customsCategoryCombo',
                        displayField: 'outName',
                        editable: false,
                        emptyText: '--select--',
                        value: customsProductInfoId,
                        fieldLabel: i18n.getKey('select') + i18n.getKey('customsCategory')
                    },
                    {
                        xtype: 'button',
                        text: i18n.getKey('save') + i18n.getKey('customsCategory'),
                        record: null,//该产品的报关要素记录
                        handler: function (btn) {
                            var customsCategory = btn.ownerCt.getComponent('customsCategoryCombo').getValue();

                            if (!Ext.isEmpty(customsCategory)) {
                                var url = adminPath + 'api/orderItems/' + orderLineItemId + '/checkCustomsCategory?customsCategoryId=' + customsCategory;
                                JSAjaxRequest(url, "PUT", true, null, i18n.getKey('saveSuccess'), function (require, success, response) {
                                    var record = orderLineItemStore.findRecord('id', orderLineItemId);
                                    record.set('customsCategoryId', customsCategory);
                                    orderLineItemStore.fireEvent('datachanged', orderLineItemStore);
                                });
                            }
                        }
                    }
                ]
            },
            listeners: {
                //只有在渲染后再加入iframe，不然渲染时报错
                afterrender: function (view) {
                    view.add([
                        {
                            region: 'center',
                            xtype: 'panel',
                            frame: false,
                            layout: 'fit',
                            html: html
                        }
                    ])
                }
            }
        });
        window.show();
    },


    showBuilderCheckHistory: function (orderLineItemId) {
        Ext.define('localModel', {
            extend: 'Ext.data.Model',
            fields: [
                'orderNumber', 'orderItemSeq', 'ipAddress',
                'emailAddress', 'viewSumTime', 'viewStartTime',
                'viewEndTime', 'remark'
            ],
        })
        Ext.define('localStore', {
            extend: 'Ext.data.Store',
            model: 'localModel',
            sorters: [{
                property: 'viewStartTime',
                direction: 'desc'
            }],
            autoLoad: true,
            proxy: {
                type: 'uxrest',
                url: adminPath + `api/orderItems/manufacturePreview/review/record`,
                reader: {
                    type: 'json',
                    root: 'data.content'
                },
                extraParams: {
                    filter: Ext.JSON.encode([{
                        "name": "orderItemId",
                        "value": orderLineItemId + '',
                        "type": "string"
                    }])
                }
            },
        });

        var store = Ext.create('localStore'),
            win = Ext.create('Ext.window.Window', {
                modal: true,
                constrain: true,
                title: '生产预览查看记录',
                layout: 'fit',
                width: '80%',
                maxHeight: 750,
                minHeight: 350,
                items: [
                    {
                        xtype: 'grid',
                        store: store,
                        columns: {
                            defaults: {
                                menuDisabled: true
                            },
                            items: [
                                {
                                    xtype: 'rownumberer',
                                    text: '序号',
                                    width: 60,
                                },
                                {
                                    text: '订单号',
                                    width: 120,
                                    dataIndex: 'orderNumber'
                                },
                                {
                                    text: '产品序号',
                                    dataIndex: 'orderItemSeq'
                                },
                                {
                                    text: '组件类型',
                                    renderer: function () {
                                        return 'Product';
                                    }
                                },
                                {
                                    text: '设备IP',
                                    width: 150,
                                    dataIndex: 'ipAddress',
                                },
                                {
                                    text: '预览人',
                                    width: 150,
                                    dataIndex: 'emailAddress',

                                },
                                {
                                    text: '预览时长（秒）',
                                    dataIndex: 'viewSumTime',
                                    renderer: function (value, metadata, record) {
                                        return value;
                                    }
                                }, {
                                    text: '预览开始时间',
                                    dataIndex: 'viewStartTime',
                                    renderer: function (value, metadata, record) {
                                        var date = new Date(value)
                                        metadata.style = "color: gray";
                                        date = Ext.Date.format(date, 'Y/m/d H:i:s');
                                        metadata.tdAttr = 'data-qtip="' + date + '"';
                                        return '<div style="white-space:normal;">' + date + '</div>';
                                    }
                                }, {
                                    text: '预览结束时间',
                                    dataIndex: 'viewEndTime',
                                    renderer: function (value, metadata, record) {
                                        if (value) {
                                            var date = new Date(value)
                                            metadata.style = "color: gray";
                                            date = Ext.Date.format(date, 'Y/m/d H:i:s');
                                            metadata.tdAttr = 'data-qtip="' + date + '"';
                                            return '<div style="white-space:normal;">' + date + '</div>';
                                        }
                                    }
                                }, {
                                    text: '备注',
                                    flex: 1,
                                    dataIndex: 'remark',
                                    renderer: function (value, metadata, record) {
                                        if (value == 'ABNORMAL_SHUTDOWN') {
                                            return `<font color="red">异常关闭</font>`;
                                        } else if (value == 'NORMAL_SHUTDOWN') {
                                            return `<font color="green">正常关闭</font>`;
                                        } else {
                                            return value;
                                        }
                                    }
                                }
                            ]

                        },
                        bbar: {
                            xtype: 'pagingtoolbar',
                            store: store
                        }
                    }
                ]
            });

        win.show();
    },

    //创建做合并列表项操作的store
    createTestMergeTableCellStore: function (id, manufactureCenter) {
        var url = adminPath + `api/order/shipmentRequirement/${id}/orderItems`,
            isEditManufactureCenter = JSGetQueryString('isEditManufactureCenter') === 'true'; //标记是否是修改生产基地页面

        return Ext.create('Ext.data.Store', {
            extend: 'Ext.data.Store',
            model: 'CGP.orderstatusmodify.view.orderitemsmultipleaddress.model.OrderLineItem',
            pageSize: 25,
            autoLoad: true,
            remoteSort: false,
            sorters: [{
                property: 'seqNo',
                direction: 'ASC'
            }],
            proxy: {
                type: 'uxrest',
                url: url,
                reader: {
                    type: 'json',
                    root: 'data.content',
                    rootProperty: 'data.content', // 假设数据在 `data.content` 中
                    totalProperty: 'data.total', // 确保总记录数在 `data.total` 中
                    readRecords: function (dataObject) {
                        var newDataObject = dataObject.data.content,
                            result = {
                                records: [],
                                success: true,
                                total: dataObject.data.totalCount
                            };

                        newDataObject.forEach(dataItem => {
                            var {componentInfos, seqNo, id} = dataItem

                            result.records.push(new this.model(dataItem));

                            if (componentInfos?.length) {
                                componentInfos.forEach(item => {
                                    var {isMainComponent} = item,
                                        data = Ext.Object.merge(item, {
                                            isComp: true,
                                            seqNo: seqNo
                                        })

                                    if (!isEditManufactureCenter) {//在生产基地页面不显示订单项组件
                                        // 主组件不显示 
                                        !isMainComponent && result.records.push(new this.model(data));
                                    }
                                })
                            }
                        })

                        return new Ext.data.ResultSet(result);
                    },
                },
            },
        })
    },

    getMultiAddressDeliveryDetailData: function (shippingDetailsId) {
        var controller = this,
            url = adminPath + 'api/order/shipmentRequirement/' + shippingDetailsId + '/multiAddressDeliveryDetail/v2',
            data = controller.getQuery(url);

        return data;
    },

    // 订单项审核窗口
    createOrderItemAuditFormWindow: function (data, callBack, isHiddenCustomerNotify) {
        var controller = this,
            data = {
                statusAudit: true,
                auditConfirm: true,
                manufactureCenter: true
            }

        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('审批订单项'),
            width: 620,
            height: 350,
            items: [
                {
                    xtype: 'errorstrickform',
                    itemId: 'form',
                    defaults: {
                        margin: '10 25 5 25',
                        allowBank: true
                    },
                    layout: 'vbox',
                    diyGetValue: function () {
                        var me = this,
                            result = {},
                            items = me.items.items;
                        items.forEach(item => {
                            var {name, disabled} = item;

                            if (!disabled && name) {
                                result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue();
                            }
                        })
                        return result;
                    },
                    diySetValue: function (data) {
                        var me = this,
                            items = me.items.items;
                        items.forEach(item => {
                            var {name} = item;
                            item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name])
                        })
                    },
                    items: [
                        {
                            xtype: 'checkbox',
                            name: 'customerNotify',
                            itemId: 'customerNotify',
                            allowBlank: true,
                            readOnly: false,
                            hidden: isHiddenCustomerNotify,
                            disabled: isHiddenCustomerNotify,
                            boxLabel: '是',
                            fieldLabel: i18n.getKey('通知客户'),
                            isValid: function () {
                                var me = this;
                                var value = me.getValue();
                                return true
                            },
                            getErrors: function () {
                                var me = this;
                                return '请勾选审核确认'
                            }
                        },
                        {
                            xtype: 'checkbox',
                            name: 'statusAudit',
                            itemId: 'statusAudit',
                            allowBlank: false,
                            readOnly: false,
                            boxLabel: i18n.getKey('审核通过'),
                            fieldLabel: i18n.getKey('审核状态'),
                            isValid: function () {
                                var me = this;
                                var value = me.getValue();
                                return value
                            },
                            getErrors: function () {
                                var me = this;
                                return '请勾选审核状态'
                            }
                        },
                        {
                            xtype: 'checkbox',
                            name: 'auditConfirm',
                            itemId: 'auditConfirm',
                            allowBlank: false,
                            readOnly: false,
                            boxLabel: JSCreateFont('red', false, '已完成对订单项信息,订单项图片以及订单项设计文档的检查'),
                            fieldLabel: i18n.getKey('审核确认'),
                            isValid: function () {
                                var me = this;
                                var value = me.getValue();
                                return value
                            },
                            getErrors: function () {
                                var me = this;
                                return '请勾选审核确认'
                            }
                        },
                        {
                            xtype: 'checkbox',
                            name: 'manufactureCenter',
                            itemId: 'manufactureCenter',
                            allowBlank: false,
                            readOnly: false,
                            boxLabel: JSCreateFont('red', false, '已完成对订单项生产基地信息确认'),
                            fieldLabel: i18n.getKey('生产基地确认'),
                            isValid: function () {
                                var me = this;
                                var value = me.getValue();
                                return value
                            },
                            getErrors: function () {
                                var me = this;
                                return '请勾选审核确认'
                            }
                        },
                        {
                            xtype: 'textarea',
                            fieldLabel: i18n.getKey('审核备注'),
                            name: 'comment',
                            itemId: 'comment',
                            height: 60,
                            width: 360,
                        }
                    ],
                    listeners: {
                        afterrender: function (comp) {
                            data && comp.diySetValue(data);
                        }
                    }
                },
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            form = win.getComponent('form'),
                            formData = form.diyGetValue();

                        if (form.isValid()) {
                            console.log(formData);
                            callBack && callBack(win, formData);
                        }
                    }
                }
            },
        }).show();
    },

    getOrderNumberData: function (orderNumber) {
        var url = adminPath + 'api/orders/v2?page=1&start=0&limit=20&filter=' + Ext.JSON.encode([
            {"name": "orderNumber", "value": `%${orderNumber}%`, "type": "string"},
        ])

        return JSGetQuery(url)[0];
    },
    getUrlRegularVersion: function (url) {
        var result = 1,
            regex = /\/pc\/(\d+)\/[^\/]+\.html/,
            match = url.match(regex);

        if (match) {
            const number = match[1];
            result = +number;

            if (!result) {
                Ext.Msg.alert('提示', '未获取到pc路径的版本 请检查路径!');
            }
        }

        return result;
    },

    // 获取查看和修改用户设计的iframe的url版本 判断其版本是否>=5
    getRegularIsGreaterFiveVersion: function (url) {
        var controller = this,
            version = controller.getUrlRegularVersion(url),
            result = version >= 5;

        return result;
    },

    createExportExcelWindow: function (title, fieldLabel, selectedIds, orderTotalCount, callBack) {
        var selectRecords = selectedIds?.length,
            noText = JSCreateFont('red', true, `(没有符合状态的数据)`),
            selectRecordText = selectRecords ? JSCreateFont('green', true, `(${selectRecords} 条)`) : '',
            orderTotalCountText = orderTotalCount ? JSCreateFont('green', true, `(${orderTotalCount} 条)`) : noText;

        return Ext.create('CGP.order.view.order.CreateWindow', {
            title: title,
            width: 600,
            formConfig: {
                items: [
                    //单选
                    {
                        xtype: 'radiogroup',
                        name: 'isAutomatic',
                        itemId: 'isAutomatic',
                        vertical: true,
                        allowBlank: true,
                        fieldLabel: fieldLabel,
                        labelWidth: 120,
                        width: '100%',
                        tipInfo: `批量审核时,将默认把非审核状态 [ 已付款(待审核) / 已确认(待审核) ] 的数据排除出审核范围中!`,
                        items: [
                            {
                                boxLabel: `当前查询 ${orderTotalCountText}`,
                                width: 200,
                                name: 'exportStrategy',
                                inputValue: 'all',
                                checked: !selectRecords
                            },
                            {
                                boxLabel: `当前选中 ${selectRecordText}`,
                                width: 200,
                                name: 'exportStrategy',
                                inputValue: 'selected',
                                disabled: !selectRecords,
                                returnArray: true,
                                checked: !!selectRecords,
                            }
                        ],
                    },
                ]
            },
            bbarConfig: {
                saveBtnCfg: {
                    width: 80,
                    text: i18n.getKey('确认'),
                    handler: function (_btn) {
                        var win = _btn.ownerCt.ownerCt,
                            form = win.getComponent('form'),
                            formValue = form.getValues(),
                            {exportStrategy} = formValue;

                        if (form.isValid()) {

                            callBack && callBack(win, exportStrategy);
                        }
                    }
                }
            }
        }).show()
    },

    createAuditErrorTextWindow: function (errorTexts, callBack) {
        var controller = this;

        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('提示'),
            width: 600,
            items: [
                {
                    xtype: 'errorstrickform',
                    itemId: 'form',
                    defaults: {
                        margin: '10 25 5 25',
                        allowBank: true,
                        isFilterComp: false,
                    },
                    layout: 'vbox',
                    diyGetValue: function () {
                        var me = this,
                            result = {},
                            items = me.items.items;

                        items.forEach(item => {
                            var {name, isFilterComp} = item;

                            if (!isFilterComp) {
                                result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue();
                            }
                        })

                        return result;
                    },
                    diySetValue: function (data) {
                        var me = this,
                            items = [];

                        data.forEach(item => {
                            items.push({
                                xtype: 'displayfield',
                                width: '100%',
                                value: item,
                            })
                        })

                        me.add(items);
                    },
                    items: [],
                    listeners: {
                        afterrender: function (comp) {
                            errorTexts && comp.diySetValue(errorTexts);
                        }
                    }
                },
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            form = win.getComponent('form'),
                            formData = form.diyGetValue();

                        if (form.isValid()) {
                            console.log(formData);
                            callBack && callBack(win, formData);
                        }
                    }
                },
                cancelBtnCfg: {
                    hidden: true,
                }
            },
        }).show();
    },

    getAuditStatusOrderTotalData: function (queryUrl, filterParams) {
        var auditStatusIds = [110, 101], //待审核状态
            totalData = [];

        auditStatusIds.forEach(statusId => {
            var newFilterParams = [...filterParams, {"name": "statusId", "value": statusId, "type": "number"}],
                queryData = JSGetQueryAllData(queryUrl, newFilterParams);

            totalData = Ext.Array.merge(totalData, queryData);
        })

        return totalData;
    },

    getQueryAllCount: function (url, filterParams, callBack, otherConfig) {
        var extraUrl = `${url}?page=1&limit=1&filter=` + Ext.JSON.encode(filterParams || []),
            count = 0,
            queryData = [];

        JSAjaxRequest(extraUrl, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText),
                    data = responseText?.data;

                if (responseText.success) {
                    queryData = data?.content || data;
                    count = data?.content ? data?.totalCount : data?.length;
                }
            }
        }, false, otherConfig);

        return count;
    },

    getAuditStatusOrderTotalCount: function (queryUrl, filterParams, isOrderItem) {
        var controller = this,
            isQueryStatusId = false,
            isQueryAuditStatusId = true,
            auditStatusIds = [110, 101], //待审核状态
            newAuditStatusIds = [110, 101],
            totalCount = 0;

        filterParams.forEach(item => {
            if (item.name === 'statusId') {
                isQueryStatusId = true;
                newAuditStatusIds = [];
                var getAuditStatusIds = item?.value?.toString().split(',');

                getAuditStatusIds.forEach(itemValue => {
                    if (auditStatusIds.includes(+itemValue)) {
                        isQueryAuditStatusId = true;
                        newAuditStatusIds.push(itemValue);
                    }
                })
            }


        })

        // 该方法是获取待审核状态的订单数量 如果自身搜索状态并非待审核状态 默认返回0
        if (isQueryAuditStatusId) {
            if (isOrderItem) {
                // 如果对订单项状态查询的 就不加订单项状态查询的
                var newFilterParams = [...filterParams];

                if (!isQueryStatusId) {
                    newFilterParams = [...filterParams, {
                        "name": "statusId",
                        "value": "110,101",
                        "type": "array,number"
                    }]
                }

                totalCount += controller.getQueryAllCount(queryUrl, newFilterParams);
            } else {
                newAuditStatusIds.forEach(statusId => {
                    // 如果对订单项状态查询的 就不加订单项状态查询的
                    var newFilterParams = [...filterParams];

                    if (!isQueryStatusId) {
                        newFilterParams = [...filterParams, {"name": "statusId", "value": statusId, "type": "number"}]
                    }

                    totalCount += controller.getQueryAllCount(queryUrl, newFilterParams);
                })
            }

        }

        return totalCount;
    },

    downloadOriginalFn: function (url, filterArray, grid, callBack) {
        var controller = this,
            authorization = 'access_token=' + Ext.util.Cookies.get('token'),
            store = grid.getStore(),
            property = store.sorters.items[0].property,
            direction = store.sorters.items[0].direction,
            sort = {"property": property, "direction": direction},
            sorters = Ext.JSON.encode([sort]),
            x = new XMLHttpRequest(),
            filterString = {
                filter: filterArray,
                sort: sorters
            }

        JSShowNotification({
            type: 'info',
            title: '导出发起成功 请耐心等待!',
        });
        x.open("POST", url, true);
        x.setRequestHeader('Content-Type', 'application/json');
        x.setRequestHeader('Access-Control-Allow-Origin', '*');
        x.setRequestHeader('Authorization', 'Bearer ' + Ext.util.Cookies.get('token'));
        x.responseType = 'blob'; // 设置响应类型为 blob

        x.onload = function (e) {

            const contentType = x.getResponseHeader("Content-Type");

            // 检查响应的内容类型
            if (x.status === 200) {
                if (contentType === 'application/json') {
                    // 处理 JSON 响应
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        var jsonResponse = JSON.parse(event.target.result),
                            {isSuccess, count, remark} = jsonResponse.data,
                            userInfo = controller.getCookieUser(),
                            {email} = userInfo;


                        if (!isSuccess) {
                            if (count >= 5000) { //超过5000禁止导出
                                Ext.Msg.alert('提示', '导出数据记录超过5000条,请联系后台工作人员帮助导出! (邮箱: dickwong@qpp.com)');
                                callBack && callBack();
                            } else if (count >= 1000) {
                                var data = { //超过1000邮件导出
                                    prompt: '导出数据记录超过1000条,系统将采用异步导出文件到您的邮箱!',
                                    email: email,
                                    remark: '',
                                }
                                controller.createExportPromptWindow(data, function (formData) {
                                    var {email, remark} = formData,
                                        result = {
                                            isSendEmail: true,
                                            email: email,
                                            remark: remark,
                                            dataExportDTO: filterString
                                        }

                                    controller.queryExportExcelEmail(url, result);
                                    callBack && callBack();
                                });

                            } else {
                                Ext.Msg.alert('导出请求报错', remark);
                            }
                        } else {
                            Ext.Msg.alert('提示', '未获取到文件流!');
                        }

                    };
                    reader.readAsText(x.response); // 读取响应为文本
                } else {
                    // 处理文件流响应
                    const blob = new Blob([x.response], {type: contentType});
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'sale_orders.xls'; // 修改文件名为合适的格式
                    a.click();

                    JSShowNotification({
                        type: 'success',
                        title: '导出成功!',
                    });
                }
            } else {
                JSShowNotification({
                    type: 'error',
                    title: '网络请求错误: ' + x.statusText,
                });
            }
        };

        x.onerror = function () {
            JSShowNotification({
                type: 'error',
                title: '请求失败，请检查网络连接!',
            });
        };

        x.send(Ext.encode({
            filter: filterArray,
            sort: sorters
        }));
    },


    // 创建导出提示窗口
    createExportPromptWindow: function (data, callBack) {
        var controller = this

        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('导出提示'),
            width: 500,
            items: [
                {
                    xtype: 'errorstrickform',
                    itemId: 'form',
                    defaults: {
                        margin: '10 25 5 25',
                        allowBlank: true,
                        width: '80%'
                    },
                    layout: 'vbox',
                    diyGetValue: function () {
                        var me = this,
                            result = {},
                            items = me.items.items;
                        items.forEach(item => {
                            var name = item['name'];
                            if (name) {
                                result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue()
                            }
                        })
                        return result;
                    },
                    diySetValue: function (data) {
                        var me = this,
                            items = me.items.items;
                        items.forEach(item => {
                            var {name} = item;
                            if (name) {
                                item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name])
                            }
                        })
                    },
                    items: [
                        {
                            xtype: 'displayfield',
                            name: 'prompt',
                            itemId: 'prompt',
                            width: '100%',
                            value: JSCreateFont('red', true, '导出数据记录超过1000条，系统将采用异步导出文件到您的邮箱!'),
                            diySetValue: function (data) {
                                var me = this;

                                data && me.setValue(JSCreateFont('red', true, data))
                            }
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('邮箱'),
                            name: 'email',
                            itemId: 'email',
                            validator: function (value) {
                                // 邮箱正则表达式
                                var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                                return emailRegex.test(value) ? true : '请输入有效的邮箱地址';
                            },
                            allowBlank: false,
                        },
                        {
                            xtype: 'textarea',
                            fieldLabel: i18n.getKey('邮件备注'),
                            height: 60,
                            margin: '10 25 10 25',
                            name: 'remark',
                            itemId: 'remark',
                        }
                    ],
                    listeners: {
                        afterrender: function (comp) {
                            data && comp.diySetValue(data);
                        }
                    }
                },
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    text: i18n.getKey('导出'),
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            form = win.getComponent('form'),
                            formData = form.diyGetValue();

                        if (form.isValid()) {
                            console.log(formData);
                            callBack && callBack(formData);
                            win.close();
                        }
                    }
                }
            },
        }).show();
    },

    // 获取当前用户信息
    getCookieUser: function () {
        var controller = this,
            cookies = document.cookie.split('; '),
            user = null;

        // 遍历所有 Cookie，查找名为 'user' 的 Cookie
        cookies.forEach(function (cookie) {
            var parts = cookie.split('=');
            if (parts[0] === 'user') {
                user = parts[1]; // 获取 Cookie 值
            }
        });

        return user ? JSON.parse(decodeURIComponent(user)) : null; // 解析并返回用户数据
    },

    // 发送邮件
    queryExportExcelEmail: function (prefixUrl, data) {
        var controller = this,
            url = `${prefixUrl}/email`;

        controller.asyncEditQuery(url, data, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    const data = responseText.data;

                    JSShowNotification({
                        type: data ? 'success' : 'error',
                        title: data ? '邮件发起成功,请耐心等待!' : '邮件发起失败,请询问开发人员!',
                    });
                }
            }
        }, false)
    },

    // 获取相同值的键
    getMergeKeysByValue: function (obj) {
        const result = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                if (!result[value]) {
                    result[value] = [];
                }
                result[value].push(key);
            }
        }
        const finalResult = {};
        for (const value in result) {
            finalResult[result[value].join(',')] = value;
        }
        return finalResult;
    }
});
