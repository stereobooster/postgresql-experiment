FROM graphile/postgraphile

COPY wait-for.sh /bin

ENV CONNECTION db:5432
ENV DB postgres
ENV USER postgres
ENV PASSWORD password

ENTRYPOINT sh -c '/bin/wait-for.sh $CONNECTION -- postgraphile -n 0.0.0.0 --connection postgresql://$USER:$PASSWORD@$CONNECTION/$DB --watch --enhance-graphiql --cors'
