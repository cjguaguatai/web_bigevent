$(function() {
    const form = layui.form
    // 初始化富文本编辑器
    initEditor()
    // $.ajax({
    //     type: 'GET',
    //     url: '/my/article/cates',
    //     success: (res) => {
    //         if(res.status !==0) return layer.msg('获取文章失败')
    //         const htmlStr = template('tpl-cate',res)
    //         $("[name=cate_id]").html(htmlStr);
    //         // 一定要记得调用 form.render() 方法 否则看不到页面的变化
    //         form.render();
    //     }

    // })
    // 获取文章分类
    const initCate = () => {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg("初始化文章分类失败！");
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);
                // 一定要记得调用 form.render() 方法 否则看不到页面的变化
                form.render();
            },
        });
    };

    //点击按钮上传图片
    $('#btnChooseImage').click(() => {
        $('#coverFile').click()
    })

    //获取到上传的图片
    $('#coverFile').change((e) => {
        console.log(e);
        const filelen = e.target.files.length
        if(filelen===0) return
        const file = e.target.files[0]
        const imgUrl = URL.createObjectURL(file)
        $image
        .cropper('destroy') // 销毁旧的裁剪区域
        .attr('src', imgUrl) // 重新设置图片路径
        .cropper(options) // 重新初始化裁剪区域
    })

    //定义发布状态
    let art_state = '已发布'

    //为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })

    //发布文章
    $('#form-pub').submit(function(e) {
        e.preventDefault()
        const fd = new FormData($(this)[0])
        fd.append('state',art_state)
        console.log(fd.get('title'));
        console.log(fd.get('cate_id'));
        console.log(fd.get('content'));
        console.log(fd.get('state'));
         // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
        .cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function(blob) {
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            // 5. 将文件对象，存储到 fd 中
            fd.append('cover_img', blob)
            // 6. 发起 ajax 数据请求
            publishArticle(fd)
        })
    })

    //发送发布文章请求
    function publishArticle(fd) {
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: fd ,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: (res) => {
                console.log(res);
                if (res.status!==0) return layer.msg('发布文章失败')
                layer.msg('发布文章成功')
                //跳转文章列表页面
                location.href = '/article/art_list.html'
                window.parent.change()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    initCate();
})