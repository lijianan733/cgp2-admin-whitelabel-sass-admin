/**
 * @Description:
 * @author nan
 * @date 2022/4/28
 */
Ext.define('CGP.cmslog.model.CMSPublishRecordModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
        }, {//发布的产品id,类目id
            name: 'selectionSources',
            type: 'array'
        }, {//发布结果状态码
            /*
            0 CMS发布配置错误
            1 准备开始
            2 成功调用到CMS系统
            3 CMS发布页生成失败
            4 CMS发布页生成成功
            5 连接Jenkins失败
            6 Jenkins发布成功
            7 Jenkins发布失败
            200 发布完成
             3*/
            name: 'status',
            type: 'int'
        }, {//指产品模式中的状态  {'TEST': '测试', 'RELEASE': '正式'};
            name: 'statusOfProduct',
            type: 'array'
        }, {//指发布了哪些类型的页面  {'ProductDetail': '详情页', 'ProductCategory': '类目页'};
            name: 'publishType',
            type: 'array'
        }, {//失败信息
            name: 'message',
            type: 'string',
        }, {//
            name: 'jobName',
            type: 'string'
        }, {//具体的发布情况
            name: 'details',
            type: 'array',
        }, {
            name: 'clazz',
            type: 'string',
            value: 'com.qpp.cgp.domain.cms.record.CMSPublishRecord'
        }, {
            name: 'createdUser',
            type: 'object'
        },
        {
            name: 'createdDate',
            type: 'number'
        },
        {
            name: 'total',
            type: 'number'
        }, {
            name: 'success',
            type: 'number'
        }, {
            name: 'failure',
            type: 'number'
        }, {//发布参数
            name: 'parameter',
            type: 'object'
        },
        {
            name: 'jenkinsParams',
            type: 'string'
        },
        {
            name: 'sourceDir',
            type: 'string'
        },
        {
            name: 'targetDir',
            type: 'string'
        },
        //发布时添加的自定义信息
        {
            name: 'extraParams',
            type: 'object',
            useNull: true,
        },
        //发布时传递的参数列表
        {
            name: 'cmsPublishRequestSnapShot',
            type: 'object',
            useNull: true,
        },
        {
            name: 'targetEnv',
            type: 'string'
        },
        //目标环境状态
        {
            name: 'targetEnvStatus',
            type: 'string',
            convert: function (value) {
                return value == 'RELEASE' ? 'Release' : 'Stage';
            }
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/cmsPublishRecords',
        reader: {
            type: 'json',
            root: 'data',
        }
    }
})