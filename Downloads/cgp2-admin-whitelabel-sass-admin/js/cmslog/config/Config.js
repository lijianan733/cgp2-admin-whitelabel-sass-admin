/**
 * @Description:
 * @author nan
 * @date 2022/4/28
 */
Ext.define('CGP.cmslog.config.Config', {
    statics: {
        statusMap: {
            0: 'CMS发布配置错误',
/*
            1: '准备开始',
*/
            2: '成功调用到CMS系统',
            3: 'CMS发布页生成失败',
            4: 'CMS发布页生成成功',
            5: '连接Jenkins失败',
            6: 'Jenkins发布中',
            7: 'Jenkins发布失败',
            200: 'CMS发布成功'
        },
        statusArr: [
            {
                value: 0,
                display: 'CMS发布配置错误'
            },
        /*    {
                value: 1,
                display: '准备开始'
            },*/
            {
                value: 2,
                display: '成功调用到CMS系统'
            },
            {
                value: 3,
                display: 'CMS发布页生成失败'
            },
            {
                value: 4,
                display: 'CMS发布页生成成功'
            },
            {
                value: 5,
                display: '连接Jenkins失败'
            },
            {
                value: 6,
                display: 'Jenkins发布中'
            },
            {
                value: 7,
                display: 'Jenkins发布失败'
            },
            {
                value: 200,
                display: 'CMS发布成功'
            }
        ],

    }
})