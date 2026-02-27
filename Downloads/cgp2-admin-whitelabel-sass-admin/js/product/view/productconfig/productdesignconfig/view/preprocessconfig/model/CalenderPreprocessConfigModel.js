/**
 * Created by nan on 2021/1/13
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.CalenderPreprocessConfigModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string'
        },
        {
            name: 'designId',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            //预处理完成后填充的目标
            name: 'targetMaterialViewType',
            type: 'object'
        },
        {
            //
            name: 'runWhenInit',
            type: 'boolean'
        }, {
            name: 'monthContainerSelector',
            type: 'string'
        },
        {//一周的开始是星期日
            name: 'firstDateOfWeek',
            type: 'number'
        },
        {//每一天区块的内容模板
            name: 'dateElementTemplate',
            type: 'object'
        }, {//每一行的间距
            name: 'dateRowSpacing',
            type: 'number'
        }, {//每一列的间距
            name: 'dateColumnSpacing',
            type: 'number'
        }, {//
            name: 'holidaySelector',
            type: 'string'
        }, {//假期所属国家
            name: 'holidayNation',
            type: 'object'
        }, {//假期元素的后出来操作
            name: 'holidayElementOperatorConfig',
            type: 'object'
        }, {//改日历使用的语言
            name: 'language',
            type: 'object'
        }, {//该日历的起始月份
            name: 'startMonth',
            type: 'object'
        }, {//该日历总共多少个月份
            name: 'total',
            type: 'object'
        }, {//显示每个月份图片的选择器
            name: 'monthImageSelector',
            type: 'string'
        }, {//月份图片的布局
            name: 'layout',
            type: 'object'
        }, {//月份图片的数据源
            name: 'background',
            type: 'object'
        }, {
            name: 'monthImageGroup',
            type: 'object'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pagecontentpreprocess',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
