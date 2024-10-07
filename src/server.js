const Hapi = require('@hapi/hapi');
const { nanoid } = require('nanoid');

let books = [];

const init = async () => {
    const server = Hapi.server({
        port: 9000,
        host: 'localhost',
        routes: {
            cors: true,
        },
    });

    server.route({
        method: 'POST',
        path: '/books',
        handler: (request, h) => {
            const {
                name, year, author, summary, publisher, pageCount, readPage, reading,
            } = request.payload;

            if (!name) {
                return h.response({
                    status: 'fail',
                    message: 'Gagal menambahkan buku. Mohon isi nama buku',
                }).code(400);
            }

            if (readPage > pageCount) {
                return h.response({
                    status: 'fail',
                    message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
                }).code(400);
            }

            const id = nanoid(16);
            const finished = pageCount === readPage;
            const insertedAt = new Date().toISOString();
            const updatedAt = insertedAt;

            const newBook = {
                id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
            };
            books.push(newBook);

            return h.response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id,
                },
            }).code(201);
        },
    });

    server.route({
        method: 'GET',
        path: '/books',
        handler: () => ({
            status: 'success',
            data: {
                books: books.map(({ id, name, publisher }) => ({ id, name, publisher })),
            },
        }),
    });

    server.route({
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: (request, h) => {
            const { bookId } = request.params;
            const index = books.findIndex((book) => book.id === bookId);

            if (index === -1) {
                return h.response({
                    status: 'fail',
                    message: 'Buku gagal dihapus. Id tidak ditemukan',
                }).code(404);
            }

            books.splice(index, 1);

            return h.response({
                status: 'success',
                message: 'Buku berhasil dihapus',
            }).code(200);
        },
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
