module.exports = grammar({
  name: "haproxy",

  extras: ($) => [/[ \t]/, $.comment],

  rules: {
    source_file: ($) => repeat($._item),

    _item: ($) => choice($.section, $.blank_line),

    blank_line: ($) => /\n/,

    section: ($) =>
      choice(
        $.global_section,
        $.defaults_section,
        $.frontend_section,
        $.backend_section,
        $.listen_section,
        $.resolvers_section,
        $.userlist_section,
        $.peers_section,
        $.mailers_section,
        $.cache_section,
        $.program_section,
        $.ring_section,
        $.fcgi_app_section,
      ),

    // SECTION DEFINITIONS
    global_section: ($) =>
      seq("global", "\n", repeat(choice(seq($._global_directive, "\n"), "\n"))),

    defaults_section: ($) =>
      seq(
        "defaults",
        optional($.section_name),
        "\n",
        repeat(choice(seq($._proxy_directive, "\n"), "\n")),
      ),

    frontend_section: ($) =>
      seq(
        "frontend",
        $.section_name,
        "\n",
        repeat(choice(seq($._frontend_directive, "\n"), "\n")),
      ),

    backend_section: ($) =>
      seq(
        "backend",
        $.section_name,
        "\n",
        repeat(choice(seq($._backend_directive, "\n"), "\n")),
      ),

    listen_section: ($) =>
      seq(
        "listen",
        $.section_name,
        optional($.bind_address),
        "\n",
        repeat(choice(seq($._listen_directive, "\n"), "\n")),
      ),

    resolvers_section: ($) =>
      seq(
        "resolvers",
        $.section_name,
        "\n",
        repeat(choice(seq($._resolvers_directive, "\n"), "\n")),
      ),

    userlist_section: ($) =>
      seq(
        "userlist",
        $.section_name,
        "\n",
        repeat(choice(seq($._userlist_directive, "\n"), "\n")),
      ),

    peers_section: ($) =>
      seq(
        "peers",
        $.section_name,
        "\n",
        repeat(choice(seq($._peers_directive, "\n"), "\n")),
      ),

    mailers_section: ($) =>
      seq(
        "mailers",
        $.section_name,
        "\n",
        repeat(choice(seq($._mailers_directive, "\n"), "\n")),
      ),

    cache_section: ($) =>
      seq(
        "cache",
        $.section_name,
        "\n",
        repeat(choice(seq($._cache_directive, "\n"), "\n")),
      ),

    program_section: ($) =>
      seq(
        "program",
        $.section_name,
        "\n",
        repeat(choice(seq($._program_directive, "\n"), "\n")),
      ),

    ring_section: ($) =>
      seq(
        "ring",
        $.section_name,
        "\n",
        repeat(choice(seq($._ring_directive, "\n"), "\n")),
      ),

    fcgi_app_section: ($) =>
      seq(
        "fcgi-app",
        $.section_name,
        "\n",
        repeat(choice(seq($._fcgi_app_directive, "\n"), "\n")),
      ),

    // DIRECTIVE CATEGORIES
    _global_directive: ($) =>
      choice(
        $.log_directive,
        $.maxconn_directive,
        $.nbproc_directive,
        $.nbthread_directive,
        $.cpu_map_directive,
        $.ssl_default_directive,
        $.tune_directive,
        $.stats_directive,
        $.daemon_directive,
        $.ca_base_directive,
        $.chroot_directive,
        $.crt_base_directive,
        $.description_directive,
        $.node_directive,
        $.pidfile_directive,
        $.uid_directive,
        $.gid_directive,
        $.user_directive,
        $.group_directive,
        $.generic_directive,
      ),

    _proxy_directive: ($) =>
      choice(
        $.mode_directive,
        $.timeout_directive,
        $.option_directive,
        $.no_option_directive,
        $.maxconn_directive,
        $.retries_directive,
        $.hash_type_directive,
        $.errorfile_directive,
        $.generic_directive,
      ),

    _frontend_directive: ($) =>
      choice(
        $.bind_directive,
        $.acl_directive,
        $.use_backend_directive,
        $.default_backend_directive,
        $.http_request_directive,
        $.http_response_directive,
        $.tcp_request_directive,
        $.redirect_directive,
        $.capture_directive,
        $._proxy_directive,
        $.use_server_directive,
      ),

    _backend_directive: ($) =>
      choice(
        $.server_directive,
        $.balance_directive,
        $.stick_directive,
        $.cookie_directive,
        $.http_check_directive,
        $.tcp_check_directive,
        $.mode_directive,
        $.timeout_directive,
        $.option_directive,
        $.no_option_directive,
        $.maxconn_directive,
        $.retries_directive,
        $.hash_type_directive,
        $.errorfile_directive,
        $.generic_directive,
      ),

    _listen_directive: ($) =>
      choice(
        $.bind_directive,
        $.server_directive,
        $.balance_directive,
        $.mode_directive,
        $.timeout_directive,
        $.option_directive,
        $.no_option_directive,
        $.maxconn_directive,
        $.retries_directive,
        $.hash_type_directive,
        $.errorfile_directive,
        $.generic_directive,
        $.use_server_directive,
      ),
    _resolvers_directive: ($) =>
      choice(
        $.nameserver_directive,
        $.resolve_retries_directive,
        $.timeout_directive,
        $.generic_directive,
      ),

    _userlist_directive: ($) =>
      choice($.user_directive, $.group_directive, $.generic_directive),

    _peers_directive: ($) =>
      choice(
        $.peer_directive,
        $.bind_directive,
        $.default_bind_directive,
        $.generic_directive,
      ),

    _mailers_directive: ($) =>
      choice($.mailer_directive, $.timeout_directive, $.generic_directive),

    _cache_directive: ($) =>
      choice(
        $.total_max_size_directive,
        $.max_age_directive,
        $.max_object_size_directive,
        $.generic_directive,
      ),

    _program_directive: ($) =>
      choice(
        $.command_directive,
        $.user_directive,
        $.group_directive,
        $.option_directive,
        $.generic_directive,
      ),

    _ring_directive: ($) =>
      choice(
        $.description_directive,
        $.format_directive,
        $.maxlen_directive,
        $.size_directive,
        $.timeout_directive,
        $.server_directive,
        $.generic_directive,
      ),

    _fcgi_app_directive: ($) => choice($.option_directive, $.generic_directive),

    // SPECIFIC DIRECTIVES
    bind_directive: ($) =>
      seq("bind", $.bind_address, optional($.bind_options)),
    default_bind_directive: ($) =>
      seq("default-bind", $.bind_address, optional($.bind_options)),
    server_directive: ($) =>
      seq(
        "server",
        $.server_name,
        $.server_address,
        optional($.server_options),
      ),
    acl_directive: ($) => seq("acl", $.acl_name, $.acl_criterion),
    use_backend_directive: ($) =>
      seq("use_backend", $.backend_ref, optional($.condition)),
    use_server_directive: ($) =>
      seq("use-server", $.server_name, optional($.condition)),
    default_backend_directive: ($) => seq("default_backend", $.backend_ref),
    mode_directive: ($) => seq("mode", $.mode_type),
    balance_directive: ($) =>
      seq("balance", $.balance_algorithm, optional($.balance_options)),
    timeout_directive: ($) => seq("timeout", $.timeout_type, $.time_value),
    option_directive: ($) =>
      seq("option", $.option_name, optional($.option_args)),
    no_option_directive: ($) => seq("no", "option", $.option_name),
    log_directive: ($) =>
      seq(
        "log",
        $.log_target,
        optional($.log_facility),
        optional($.log_level),
        optional($.log_options),
      ),
    maxconn_directive: ($) => seq("maxconn", $.number),
    nbproc_directive: ($) => seq("nbproc", $.number),
    nbthread_directive: ($) => seq("nbthread", $.number),
    cpu_map_directive: ($) => seq("cpu-map", $.cpu_map_args),
    ssl_default_directive: ($) => seq(/ssl-default-[a-z-]+/, $.ssl_options),
    tune_directive: ($) => seq("tune", ".", $.tune_option, $.tune_value),
    stats_directive: ($) => seq("stats", $.stats_option),
    daemon_directive: ($) => "daemon",
    ca_base_directive: ($) => seq("ca-base", $.path),
    chroot_directive: ($) => seq("chroot", $.path),
    crt_base_directive: ($) => seq("crt-base", $.path),
    description_directive: ($) => seq("description", $.string),
    node_directive: ($) => seq("node", $.identifier),
    pidfile_directive: ($) => seq("pidfile", $.path),
    uid_directive: ($) => seq("uid", $.number),
    gid_directive: ($) => seq("gid", $.number),
    user_directive: ($) => seq("user", $.identifier, optional($.user_options)),
    group_directive: ($) =>
      seq("group", $.identifier, optional($.group_options)),
    retries_directive: ($) => seq("retries", $.number),
    hash_type_directive: ($) => seq("hash-type", $.hash_algorithm),
    errorfile_directive: ($) => seq("errorfile", $.http_status, $.path),
    http_request_directive: ($) => seq("http-request", $.http_action),
    http_response_directive: ($) => seq("http-response", $.http_action),
    tcp_request_directive: ($) =>
      choice(
        seq("tcp-request", $.tcp_type, $.tcp_action),
        seq("tcp-request", "inspect-delay", $.time_value),
      ),
    redirect_directive: ($) => seq("redirect", $.redirect_rule),
    capture_directive: ($) => seq("capture", $.capture_type, $.capture_args),
    stick_directive: ($) => seq("stick", $.stick_rule),
    cookie_directive: ($) =>
      seq("cookie", $.cookie_name, optional($.cookie_options)),
    http_check_directive: ($) => seq("http-check", $.check_action),
    tcp_check_directive: ($) => seq("tcp-check", $.check_action),
    nameserver_directive: ($) => seq("nameserver", $.identifier, $.address),
    resolve_retries_directive: ($) => seq("resolve_retries", $.number),
    peer_directive: ($) => seq("peer", $.identifier, $.address),
    mailer_directive: ($) => seq("mailer", $.identifier, $.address),
    total_max_size_directive: ($) => seq("total-max-size", $.size),
    max_age_directive: ($) => seq("max-age", $.number),
    max_object_size_directive: ($) => seq("max-object-size", $.size),
    command_directive: ($) => seq("command", $.command_line),
    format_directive: ($) => seq("format", $.format_type),
    maxlen_directive: ($) => seq("maxlen", $.number),
    size_directive: ($) => seq("size", $.size),

    generic_directive: ($) => seq($.directive_name, optional($.directive_args)),

    // COMPONENTS
    section_name: ($) => /[a-zA-Z0-9_.-]+/,
    directive_name: ($) => /[a-zA-Z0-9_.-]+/,
    directive_args: ($) => /.+/,

    bind_address: ($) => /[0-9a-zA-Z.:*\[\]/@-]+/,
    bind_options: ($) => /.+/,

    server_name: ($) => /[a-zA-Z0-9_.-]+/,
    server_address: ($) => /[0-9a-zA-Z.:*\[\]\-_${}]+/,
    server_options: ($) => /.+/,

    acl_name: ($) => /[a-zA-Z0-9_.-]+/,
    acl_criterion: ($) => /.+/,

    backend_ref: ($) => /[a-zA-Z0-9_.-]+/,
    condition: ($) => seq(choice("if", "unless"), $.condition_expr),
    condition_expr: ($) => /.+/,

    mode_type: ($) => choice("http", "tcp", "health"),

    balance_algorithm: ($) =>
      choice(
        "roundrobin",
        "static-rr",
        "leastconn",
        "first",
        "source",
        "uri",
        "url_param",
        "hdr",
        "random",
        "rdp-cookie",
      ),
    balance_options: ($) => /.+/,

    timeout_type: ($) =>
      choice(
        "client",
        "client-fin",
        "connect",
        "server",
        "server-fin",
        "tunnel",
        "http-request",
        "http-keep-alive",
        "queue",
        "tarpit",
        "check",
        "mail",
        "retry",
      ),
    time_value: ($) => /\d+(us|ms|s|m|h|d)?/,

    option_name: ($) => /[a-zA-Z0-9-]+/,
    option_args: ($) => /.+/,

    log_target: ($) => /[0-9a-zA-Z.:/@-]+/,
    log_facility: ($) => /[a-zA-Z0-9]+/,
    log_level: ($) =>
      choice(
        "emerg",
        "alert",
        "crit",
        "err",
        "warning",
        "notice",
        "info",
        "debug",
      ),
    log_options: ($) => /.+/,

    number: ($) => /\d+/,
    size: ($) => /\d+[kKmMgG]?/,
    path: ($) => /[^\s]+/,
    string: ($) =>
      token(choice(seq('"', /[^"]*/, '"'), seq("'", /[^']*/, "'"), /[^\s]+/)),
    identifier: ($) => /[a-zA-Z0-9_.-]+/,
    address: ($) => /[0-9a-zA-Z.:/@-]+/,
    http_status: ($) => /\d{3}/,

    cpu_map_args: ($) => /.+/,
    ssl_options: ($) => /.+/,
    tune_option: ($) => /[a-zA-Z0-9.-]+/,
    tune_value: ($) => /.+/,
    stats_option: ($) => /.+/,
    user_options: ($) => /.+/,
    group_options: ($) => /.+/,
    hash_algorithm: ($) => /.+/,
    http_action: ($) => /.+/,
    tcp_type: ($) => choice("connection", "content", "session"),
    tcp_action: ($) => /.+/,
    redirect_rule: ($) => /.+/,
    capture_type: ($) => choice("request", "response", "cookie"),
    capture_args: ($) => /.+/,
    stick_rule: ($) => /.+/,
    cookie_name: ($) => /[a-zA-Z0-9_.-]+/,
    cookie_options: ($) => /.+/,
    check_action: ($) => /.+/,
    command_line: ($) => /.+/,
    format_type: ($) => /.+/,

    comment: ($) => token(seq("#", /.*/)),
  },
});
