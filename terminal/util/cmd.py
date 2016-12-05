import os


def cmd_ls(directory):
    return '    '.join(os.listdir(directory))


def cmd_cd(current_dir, arg):
    return_dict = {'dir': current_dir, 'message': ''}

    if arg is None:
        return return_dict

    arg_list = arg.split('/')
    target_dir = ''

    if arg_list[0] == '':
        target_dir = '/'
        while arg_list[0] == '':
            if arg_list:
                arg_list.pop(0)
                if not arg_list:
                    return_dict['dir'] = target_dir
                    return return_dict

        if not arg_list:
            return_dict['dir'] = target_dir
            return return_dict

    else:
        target_dir = current_dir

    for dirname in arg_list:
        if dirname in os.listdir(target_dir):
            target_dir = target_dir + dirname + '/'
        else:
            return_dict['message'] = 'cd: ' + arg + ': No such file or directory'
            return return_dict

    dirlist = target_dir.split('/')
    dirlist.pop(0)
    dirlist.pop(-1)
    dirstr = '/' + '/'.join(dirlist)
    return_dict['dir'] = dirstr

    return return_dict
