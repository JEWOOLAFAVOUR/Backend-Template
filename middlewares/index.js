exports.parseData = (req, res, next) => {
    const { tags, featured, menu } = req.body;
    // if (tags) req.body.tags = JSON.parse(tags);
    // if (menu) req.body.menu = JSON.parse(menu);
    // if (contact) req.body.contact = JSON.parse(contact);
    // if (featured) req.body.featured = JSON.parse(featured);
    // // if (phone) req.body.phone = JSON.parse(phone);

    // console.log(typeof JSON.parse(tags))
    next();
}